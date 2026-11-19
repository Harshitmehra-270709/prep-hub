import { TokenBucket } from './tokenBucket.js';
import { CircuitBreaker } from './circuitBreaker.js';
import { withRetry } from './retry.js';
import { AllProvidersFailedError } from '../../lib/errors.js';
import { logger } from '../../lib/logger.js';

/**
 * Ordered fallback across interchangeable providers for one capability (STT, TTS, ...).
 *
 * Each provider is guarded, in order of cheapness, by:
 *   1. isConfigured()  - no key, no attempt; lets the server run on a subset of vendors.
 *   2. circuit breaker - skip vendors that are currently down without spending a timeout.
 *   3. token bucket    - skip vendors we would push past their rate limit; a short wait is
 *                        allowed, longer than that and the next provider is faster.
 *   4. retry           - absorb transient errors before declaring this provider failed.
 *
 * A provider is a plain object: { name, isConfigured(), run(input, { signal }) }.
 * The chain returns { provider, result } so callers can log or surface who served it.
 */
export class ProviderChain {
  constructor(capability, providers, {
    rateLimits = {},
    maxQueueWaitMs = 1_500,
    retry = {},
    breaker = {},
    timeoutMs = 30_000,
  } = {}) {
    this.capability = capability;
    this.maxQueueWaitMs = maxQueueWaitMs;
    this.retry = retry;
    this.timeoutMs = timeoutMs;
    this.entries = providers.map((provider) => ({
      provider,
      bucket: rateLimits[provider.name] ? new TokenBucket(rateLimits[provider.name]) : null,
      breaker: new CircuitBreaker(breaker),
    }));
  }

  async run(input) {
    const attempts = [];

    for (const { provider, bucket, breaker } of this.entries) {
      if (!provider.isConfigured()) {
        attempts.push({ provider: provider.name, skipped: 'not_configured' });
        continue;
      }
      if (!breaker.canRequest()) {
        attempts.push({ provider: provider.name, skipped: 'circuit_open' });
        continue;
      }
      if (bucket) {
        try {
          await bucket.take(1, { maxWaitMs: this.maxQueueWaitMs });
        } catch (err) {
          // Admitted by the breaker but never called: release the half-open trial slot.
          breaker.releaseTrial();
          attempts.push({ provider: provider.name, skipped: 'rate_limited', retryAfterMs: err.retryAfterMs });
          continue;
        }
      }

      try {
        const result = await withRetry(
          () => provider.run(input, { signal: AbortSignal.timeout(this.timeoutMs) }),
          {
            ...this.retry,
            onRetry: ({ attempt, delay, error }) =>
              logger.warn('provider retry', { capability: this.capability, provider: provider.name, attempt, delay, error: error.message }),
          },
        );
        breaker.recordSuccess();
        return { provider: provider.name, result };
      } catch (err) {
        breaker.recordFailure();
        attempts.push({ provider: provider.name, error: err.message, status: err.status });
        logger.warn('provider failed, falling back', { capability: this.capability, provider: provider.name, error: err.message });
      }
    }

    throw new AllProvidersFailedError(this.capability, attempts);
  }

  /** Live view for /api/health: configuration, breaker state and remaining rate budget. */
  status() {
    return this.entries.map(({ provider, bucket, breaker }) => ({
      provider: provider.name,
      configured: provider.isConfigured(),
      breaker: breaker.snapshot(),
      rateLimit: bucket?.snapshot() ?? null,
    }));
  }
}
