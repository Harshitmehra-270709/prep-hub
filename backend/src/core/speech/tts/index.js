import { ProviderChain } from '../../resilience/providerChain.js';
import { config } from '../../../config/index.js';
import { elevenlabsTts } from './elevenlabs.js';
import { openaiTts } from './openaiTts.js';

/** Max characters per synthesis call; interviewer turns are a few sentences, well under this. */
export const TTS_MAX_CHARS = 2_500;

/** Text-to-speech entry point: ElevenLabs first, OpenAI as the fallback. */
export function createTtsChain(providers = [elevenlabsTts, openaiTts]) {
  return new ProviderChain('text-to-speech', providers, {
    rateLimits: { elevenlabs: config.rateLimits.elevenlabs, openaiTts: config.rateLimits.openaiTts },
    timeoutMs: config.providerTimeoutMs,
  });
}
