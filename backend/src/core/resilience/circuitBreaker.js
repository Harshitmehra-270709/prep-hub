/**
 * Circuit breaker (closed -> open -> half-open).
 *
 * Retries handle a single flaky request; the breaker handles a provider that is down.
 * After `failureThreshold` consecutive failures we stop calling it for `cooldownMs`, so a
 * dead vendor costs one fast skip per request instead of a full timeout plus retries.
 * When the cooldown ends, one trial request is let through (half-open): success closes
 * the circuit, failure re-opens it for another cooldown.
 */
export class CircuitBreaker {
  constructor({ failureThreshold = 3, cooldownMs = 30_000, now = () => Date.now() } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.now = now;
    this.state = 'closed';
    this.failures = 0;
    this.openedAt = 0;
    this.trialInFlight = false;
  }

  /** True if a request may be sent now. In half-open, only one trial is admitted. */
  canRequest() {
    if (this.state === 'closed') return true;
    if (this.state === 'open' && this.now() - this.openedAt >= this.cooldownMs) {
      this.state = 'half_open';
      this.trialInFlight = false;
    }
    if (this.state === 'half_open' && !this.trialInFlight) {
      this.trialInFlight = true;
      return true;
    }
    return false;
  }

  /** Gives back a half-open trial slot that was admitted but never used (e.g. rate-limited locally). */
  releaseTrial() {
    this.trialInFlight = false;
  }

  recordSuccess() {
    this.state = 'closed';
    this.failures = 0;
    this.trialInFlight = false;
  }

  recordFailure() {
    this.failures += 1;
    this.trialInFlight = false;
    if (this.state === 'half_open' || this.failures >= this.failureThreshold) {
      this.state = 'open';
      this.openedAt = this.now();
    }
  }

  snapshot() {
    return { state: this.state, consecutiveFailures: this.failures };
  }
}
