import { config } from '../../../config/index.js';
import { ProviderError } from '../../../lib/errors.js';

/** OpenAI speech synthesis (fallback TTS). Same MP3 contract as the primary provider. */
export const openaiTts = {
  name: 'openaiTts',

  isConfigured: () => Boolean(config.openai.apiKey),

  async run({ text }, { signal }) {
    let res;
    try {
      res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.openai.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.openai.ttsModel,
          voice: config.openai.ttsVoice,
          input: text,
          response_format: 'mp3',
        }),
        signal,
      });
    } catch (err) {
      throw ProviderError.fromNetwork('openaiTts', err);
    }
    if (!res.ok) throw await ProviderError.fromResponse('openaiTts', res);

    return { audio: Buffer.from(await res.arrayBuffer()), mimeType: 'audio/mpeg' };
  },
};
