/**
 * Minimal structured logger: one JSON object per line, which every log shipper
 * (CloudWatch, Loki, Datadog) can index without a parsing rule. Swap for pino if
 * throughput ever matters; the call sites stay the same.
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = LEVELS[process.env.LOG_LEVEL ?? 'info'] ?? LEVELS.info;

function write(level, msg, fields = {}) {
  if (LEVELS[level] < threshold || process.env.NODE_ENV === 'test') return;
  const line = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...fields });
  (level === 'error' || level === 'warn' ? console.error : console.log)(line);
}

export const logger = {
  debug: (msg, fields) => write('debug', msg, fields),
  info: (msg, fields) => write('info', msg, fields),
  warn: (msg, fields) => write('warn', msg, fields),
  error: (msg, fields) => write('error', msg, fields),
};
