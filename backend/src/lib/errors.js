/**
 * Error taxonomy.
 *
 * AppError carries an HTTP status so the error middleware can answer without guessing.
 * ProviderError adds the two facts the resilience layer needs from an upstream failure:
 * whether retrying can help, and how long the vendor asked us to wait.
 */

export class AppError extends Error {
  constructor(message, { status = 500, code = 'internal_error', details } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, { status: 404, code: 'not_found' });
  }
}

export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, { status: 400, code: 'invalid_request', details });
  }
}

export class ProviderError extends AppError {
  constructor(message, { provider, status = 502, retryable = false, retryAfterMs, cause } = {}) {
    super(message, { status, code: 'provider_error' });
    this.provider = provider;
    this.retryable = retryable;
    this.retryAfterMs = retryAfterMs;
    if (cause) this.cause = cause;
  }

  /** Builds a ProviderError from a non-2xx fetch Response, reading Retry-After when present. */
  static async fromResponse(provider, res) {
    let body = '';
    try {
      body = (await res.text()).slice(0, 500);
    } catch {
      /* body is best-effort context only */
    }
    const retryAfter = Number.parseFloat(res.headers.get('retry-after') ?? '');
    return new ProviderError(`${provider} responded ${res.status}: ${body || res.statusText}`, {
      provider,
      status: res.status >= 500 ? 502 : res.status,
      retryable: res.status === 408 || res.status === 429 || res.status >= 500,
      retryAfterMs: Number.isFinite(retryAfter) ? retryAfter * 1000 : undefined,
    });
  }

  /** Network-level failures (DNS, reset, abort on timeout) are always worth one more try. */
  static fromNetwork(provider, err) {
    const timedOut = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    return new ProviderError(`${provider} ${timedOut ? 'timed out' : 'network error'}: ${err.message}`, {
      provider,
      status: timedOut ? 504 : 502,
      retryable: true,
      cause: err,
    });
  }
}

export class RateLimitExceededError extends AppError {
  constructor(message, retryAfterMs) {
    super(message, { status: 429, code: 'rate_limited' });
    this.retryAfterMs = retryAfterMs;
  }
}

export class AllProvidersFailedError extends AppError {
  constructor(capability, attempts) {
    super(`No ${capability} provider could complete the request`, {
      status: 503,
      code: 'providers_unavailable',
      details: attempts,
    });
  }
}
