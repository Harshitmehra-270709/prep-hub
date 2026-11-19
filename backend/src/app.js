import express from 'express';
import { config, providerStatus } from './config/index.js';
import { createSttChain } from './core/speech/stt/index.js';
import { createTtsChain } from './core/speech/tts/index.js';
import { llmStatus } from './core/llm/claudeClient.js';
import { SessionStore } from './core/orchestrator/sessionStore.js';
import { MultimodalOrchestrator } from './core/orchestrator/multimodalOrchestrator.js';
import { resumeAnalystAgent, interviewerAgent, evaluatorAgent } from './agents/index.js';
import { createRoutes } from './http/routes.js';
import { cors, clientRateLimit, errorHandler, notFound } from './http/middleware.js';

/**
 * Composition root. Builds the object graph once and wires it into Express.
 *
 * Every collaborator can be overridden, which is how the tests run the full HTTP stack
 * against stub agents and stub speech providers without network access or API keys.
 */
export function createApp(overrides = {}) {
  const store = overrides.store ?? new SessionStore({ ttlMs: config.interview.sessionTtlMs });
  const stt = overrides.stt ?? createSttChain();
  const tts = overrides.tts ?? createTtsChain();
  const agents = overrides.agents ?? {
    resumeAnalyst: resumeAnalystAgent,
    interviewer: interviewerAgent,
    evaluator: evaluatorAgent,
  };

  const orchestrator = new MultimodalOrchestrator({
    store,
    stt,
    tts,
    agents,
    maxQuestions: overrides.maxQuestions ?? config.interview.maxQuestions,
  });

  const health = () => ({
    status: 'ok',
    uptimeSec: Math.round(process.uptime()),
    activeSessions: store.size,
    providers: providerStatus(),
    llm: llmStatus(),
    speechToText: stt.status(),
    textToSpeech: tts.status(),
  });

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');
  app.use(cors(config.corsOrigins));
  app.use(express.json({ limit: '256kb' }));
  app.use('/api', clientRateLimit(overrides.clientRateLimit ?? config.rateLimits.client));
  app.use('/api', createRoutes({ orchestrator, health, maxAudioBytes: config.maxAudioBytes }));
  app.use(notFound);
  app.use(errorHandler);

  return { app, store, orchestrator };
}
