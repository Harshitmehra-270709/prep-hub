import { RateLimitExceededError } from '../../lib/errors.js';

/**
 * Token-bucket rate limiter.
 *
 * Chosen over a fixed window because it allows short bursts (a candidate finishing an
 * answer triggers STT + LLM + TTS back to back) while still enforcing the long-run rate
 * vendors bill and throttle on. Refill is computed lazily from elapsed time, so there are
 * no timers to leak and the bucket costs nothing while idle.
 *
 * `now` and `sleep` are injectable so the tests run deterministically without real waits.
 */
export class TokenBucket {
  constructor({ capacity, refillPerSecond, now = () => Date.now(), sleep = defaultSleep }) {
    if (!(capacity > 0) || !(refillPerSecond > 0)) {
      throw new TypeError('TokenBucket needs a positive capacity and refillPerSecond');
    }
    this.capacity = capacity;
    this.refillPerMs = refillPerSecond / 1000;
    this.tokens = capacity;
    this.now = now;
    this.sleep = sleep;
    this.updatedAt = now();
  }

  #refill() {
    const t = this.now();
    this.tokens = Math.min(this.capacity, this.tokens + (t - this.updatedAt) * this.refillPerMs);
    this.updatedAt = t;
  }

  /** Milliseconds until `count` tokens will be available (0 if they already are). */
  msUntilAvailable(count = 1) {
    this.#refill();
    const missing = count - this.tokens;
    return missing <= 0 ? 0 : Math.ceil(missing / this.refillPerMs);
  }

  /** Non-blocking: takes the tokens and returns true, or leaves the bucket untouched. */
  tryRemove(count = 1) {
    this.#refill();
    if (this.tokens < count) return false;
    this.tokens -= count;
    return true;
  }

  /**
   * Waits up to `maxWaitMs` for tokens. Callers on a latency budget pass a small wait so
   * they can fall through to another provider instead of queueing behind a busy one.
   */
  async take(count = 1, { maxWaitMs = 0 } = {}) {
    if (count > this.capacity) {
      throw new RangeError(`Requested ${count} tokens from a bucket of ${this.capacity}`);
    }
    const wait = this.msUntilAvailable(count);
    if (wait > maxWaitMs) {
      throw new RateLimitExceededError('Rate limit reached', wait);
    }
    if (wait > 0) await this.sleep(wait);
    if (!this.tryRemove(count)) {
      // Another caller won the race during our sleep; report rather than spin.
      throw new RateLimitExceededError('Rate limit reached', this.msUntilAvailable(count));
    }
  }

  snapshot() {
    this.#refill();
    return { tokens: Math.floor(this.tokens * 100) / 100, capacity: this.capacity };
  }
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
