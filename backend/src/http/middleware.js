import { TokenBucket } from '../core/resilience/tokenBucket.js';
import { AppError, ValidationError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

/**
 * CORS for the static frontend. Hand-rolled because the policy is one allow-list and the
 * `cors` package would be a dependency for ten lines.
 */
export function cors(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  };
}

/**
 * Inbound rate limit, one token bucket per client IP. This protects the paid upstream
 * APIs from a single noisy client; the per-provider buckets protect the vendor quotas.
 * Idle buckets are evicted so the map cannot grow without bound.
 */
export function clientRateLimit({ capacity, refillPerSecond, idleMs = 10 * 60_000 }) {
  const buckets = new Map();
  const evictor = setInterval(() => {
    const cutoff = Date.now() - idleMs;
    for (const [ip, entry] of buckets) if (entry.seen < cutoff) buckets.delete(ip);
  }, idleMs);
  evictor.unref?.();

  return (req, res, next) => {
    const ip = req.ip ?? 'unknown';
    let entry = buckets.get(ip);
    if (!entry) {
      entry = { bucket: new TokenBucket({ capacity, refillPerSecond }), seen: 0 };
      buckets.set(ip, entry);
    }
    entry.seen = Date.now();
    if (entry.bucket.tryRemove()) return next();
    const waitMs = entry.bucket.msUntilAvailable();
    res.setHeader('Retry-After', Math.ceil(waitMs / 1000));
    res.status(429).json({ error: { code: 'rate_limited', message: 'Too many requests, slow down.' } });
  };
}

/** Validates req.body against a Zod schema and replaces it with the parsed value. */
export function validateBody(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return next(new ValidationError('Invalid request body', parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))));
    }
    req.body = parsed.data;
    next();
  };
}

export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'not_found', message: 'Route not found' } });
}

/**
 * Final error handler. Known AppErrors are returned as-is; anything else is logged with
 * its stack and reported as a generic 500 so internals never leak to the client.
 */
export function errorHandler(err, req, res, _next) {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: { code: 'payload_too_large', message: 'Audio file is too large' } });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'invalid_json', message: 'Request body is not valid JSON' } });
  }
  if (err instanceof AppError) {
    if (err.status >= 500) logger.warn('request failed', { path: req.path, code: err.code, error: err.message });
    if (err.retryAfterMs) res.setHeader('Retry-After', Math.ceil(err.retryAfterMs / 1000));
    return res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
  }
  logger.error('unhandled error', { path: req.path, error: err?.message, stack: err?.stack });
  res.status(500).json({ error: { code: 'internal_error', message: 'Something went wrong' } });
}
