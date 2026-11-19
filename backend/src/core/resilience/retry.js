/**
 * Retry with exponential backoff and full jitter.
 *
 * Full jitter (random delay in [0, cap]) rather than fixed doubling: when a vendor has a
 * blip, every in-flight interview retries at once, and jitter spreads those retries out
 * instead of hammering the vendor in synchronized waves. A server-provided Retry-After
 * always wins over our own schedule.
 *
 * Only errors flagged `retryable` are retried; a 400 or 401 will fail the same way every
 * time, so retrying it just adds latency before the fallback provider gets a turn.
 */
export async function withRetry(fn, {
  retries = 2,
  baseDelayMs = 250,
  maxDelayMs = 4_000,
  shouldRetry = (err) => Boolean(err?.retryable),
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  random = Math.random,
  onRetry,
} = {}) {
  let attempt = 0;
  for (;;) {
    try {
      return await fn(attempt);
    } catch (err) {
      if (attempt >= retries || !shouldRetry(err)) throw err;
      const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
      const delay = err?.retryAfterMs != null
        ? Math.min(err.retryAfterMs, maxDelayMs)
        : Math.round(random() * backoff);
      onRetry?.({ attempt: attempt + 1, delay, error: err });
      await sleep(delay);
      attempt += 1;
    }
  }
}
