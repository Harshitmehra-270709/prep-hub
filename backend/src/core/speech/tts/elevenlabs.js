import { config } from '../../../config/index.js';
import { ProviderError } from '../../../lib/errors.js';

/**
 * ElevenLabs text-to-speech (primary TTS). Picked for the interviewer voice because its
 * prosody on questions sounds noticeably less robotic, which matters when the point of
 * the product is to feel like a real interview.
 */
export const elevenlabsTts = {
  name: 'elevenlabs',

  isConfigured: () => Boolean(config.elevenlabs.apiKey && config.elevenlabs.voiceId),

  async run({ text }, { signal }) {
    const url = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(config.elevenlabs.voiceId)}`);
    url.searchParams.set('output_format', 'mp3_44100_128');

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': config.elevenlabs.apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({ text, model_id: config.elevenlabs.modelId }),
        signal,
      });
    } catch (err) {
      throw ProviderError.fromNetwork('elevenlabs', err);
    }
    if (!res.ok) throw await ProviderError.fromResponse('elevenlabs', res);

    return { audio: Buffer.from(await res.arrayBuffer()), mimeType: 'audio/mpeg' };
  },
};
