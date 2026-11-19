import { ProviderChain } from '../../resilience/providerChain.js';
import { config } from '../../../config/index.js';
import { deepgramStt } from './deepgram.js';
import { openaiWhisperStt } from './openaiWhisper.js';

/**
 * Speech-to-text entry point. Order matters: Deepgram first (keeps filler words, lower
 * latency), OpenAI as the fallback when Deepgram is unconfigured, rate-limited or down.
 */
export function createSttChain(providers = [deepgramStt, openaiWhisperStt]) {
  return new ProviderChain('speech-to-text', providers, {
    rateLimits: { deepgram: config.rateLimits.deepgram, openaiStt: config.rateLimits.openaiStt },
    timeoutMs: config.providerTimeoutMs,
  });
}
