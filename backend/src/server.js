import { createApp } from './app.js';
import { config, providerStatus } from './config/index.js';
import { logger } from './lib/logger.js';

const { app, store } = createApp();

const server = app.listen(config.port, () => {
  logger.info('prep-hub backend listening', { port: config.port, env: config.env, providers: providerStatus() });
  const missing = Object.entries(providerStatus()).filter(([, ok]) => !ok).map(([name]) => name);
  if (missing.length) {
    logger.warn('some providers have no API key; their features fall back or return 503', { missing });
  }
});

// Graceful shutdown: stop accepting connections, let in-flight requests (a report can take
// several seconds to generate) finish, then exit. Force-exit if draining stalls.
function shutdown(signal) {
  logger.info('shutting down', { signal });
  store.close();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 15_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
