process.env.NODE_ENV = 'test';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TokenBucket } from '../src/core/resilience/tokenBucket.js';
import { withRetry } from '../src/core/resilience/retry.js';
import { CircuitBreaker } from '../src/core/resilience/circuitBreaker.js';
import { ProviderChain } from '../src/core/resilience/providerChain.js';
import { ProviderError, RateLimitExceededError, AllProvidersFailedError } from '../src/lib/errors.js';

const clock = (start = 0) => {
  let t = start;
  return { now: () => t, advance: (ms) => { t += ms; } };
};

test('token bucket allows a burst up to capacity, then refills over time', () => {
  const c = clock();
  const bucket = new TokenBucket({ capacity: 3, refillPerSecond: 1, now: c.now });
  assert.equal(bucket.tryRemove(), true);
  assert.equal(bucket.tryRemove(), true);
  assert.equal(bucket.tryRemove(), true);
  assert.equal(bucket.tryRemove(), false);
  assert.equal(bucket.msUntilAvailable(), 1000);
  c.advance(1000);
  assert.equal(bucket.tryRemove(), true);
  c.advance(60_000);
  assert.equal(bucket.snapshot().tokens, 3, 'refill is capped at capacity');
});

test('token bucket take() waits within budget and rejects beyond it', async () => {
  const c = clock();
  const slept = [];
  const bucket = new TokenBucket({ capacity: 1, refillPerSecond: 2, now: c.now, sleep: async (ms) => { slept.push(ms); c.advance(ms); } });
  await bucket.take();
  await bucket.take(1, { maxWaitMs: 1000 });
  assert.deepEqual(slept, [500]);
  await assert.rejects(bucket.take(1, { maxWaitMs: 100 }), (err) => err instanceof RateLimitExceededError && err.retryAfterMs === 500);
});

test('withRetry retries retryable errors and honours Retry-After', async () => {
  const delays = [];
  let calls = 0;
  const result = await withRetry(async () => {
    calls += 1;
    if (calls === 1) throw new ProviderError('busy', { retryable: true, retryAfterMs: 1200 });
    if (calls === 2) throw new ProviderError('blip', { retryable: true });
    return 'ok';
  }, { retries: 3, baseDelayMs: 100, sleep: async (ms) => { delays.push(ms); }, random: () => 0.5 });
  assert.equal(result, 'ok');
  assert.equal(calls, 3);
  assert.deepEqual(delays, [1200, 100]); // Retry-After, then 0.5 * (100 * 2^1)
});

test('withRetry does not retry non-retryable errors', async () => {
  let calls = 0;
  await assert.rejects(withRetry(async () => { calls += 1; throw new ProviderError('bad key', { retryable: false }); }, { sleep: async () => {} }));
  assert.equal(calls, 1);
});

test('circuit breaker opens after the threshold, then admits one half-open trial', () => {
  const c = clock();
  const breaker = new CircuitBreaker({ failureThreshold: 2, cooldownMs: 1000, now: c.now });
  breaker.recordFailure();
  assert.equal(breaker.canRequest(), true);
  breaker.recordFailure();
  assert.equal(breaker.state, 'open');
  assert.equal(breaker.canRequest(), false);
  c.advance(1000);
  assert.equal(breaker.canRequest(), true, 'trial admitted after cooldown');
  assert.equal(breaker.canRequest(), false, 'only one trial at a time');
  breaker.recordSuccess();
  assert.equal(breaker.state, 'closed');
});

const provider = (name, impl, configured = true) => ({ name, isConfigured: () => configured, run: impl });

test('provider chain falls back to the next provider when the first fails', async () => {
  const chain = new ProviderChain('stt', [
    provider('primary', async () => { throw new ProviderError('down', { retryable: false }); }),
    provider('backup', async (input) => `heard:${input}`),
  ]);
  const out = await chain.run('hello');
  assert.deepEqual(out, { provider: 'backup', result: 'heard:hello' });
});

test('provider chain skips unconfigured providers and reports every attempt on total failure', async () => {
  const chain = new ProviderChain('tts', [
    provider('nokey', async () => 'never', false),
    provider('broken', async () => { throw new ProviderError('500', { retryable: false }); }),
  ]);
  await assert.rejects(chain.run('x'), (err) => {
    assert.ok(err instanceof AllProvidersFailedError);
    assert.deepEqual(err.details.map((a) => a.provider), ['nokey', 'broken']);
    assert.equal(err.details[0].skipped, 'not_configured');
    return true;
  });
});

test('provider chain stops calling a provider whose circuit is open', async () => {
  let primaryCalls = 0;
  const chain = new ProviderChain('stt', [
    provider('flaky', async () => { primaryCalls += 1; throw new ProviderError('down', { retryable: false }); }),
    provider('backup', async () => 'ok'),
  ], { breaker: { failureThreshold: 2, cooldownMs: 60_000 } });
  for (let i = 0; i < 5; i++) await chain.run('x');
  assert.equal(primaryCalls, 2, 'after two failures the breaker short-circuits the primary');
  assert.equal(chain.status()[0].breaker.state, 'open');
});

test('provider chain falls through when a provider is rate limited', async () => {
  const chain = new ProviderChain('tts', [
    provider('limited', async () => 'primary'),
    provider('backup', async () => 'backup'),
  ], { rateLimits: { limited: { capacity: 1, refillPerSecond: 0.001 } }, maxQueueWaitMs: 0 });
  assert.equal((await chain.run('a')).provider, 'limited');
  assert.equal((await chain.run('b')).provider, 'backup');
});
