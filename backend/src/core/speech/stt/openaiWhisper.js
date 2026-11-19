import { config } from '../../../config/index.js';
import { ProviderError } from '../../../lib/errors.js';

/**
 * OpenAI transcription (fallback STT).
 *
 * whisper-1 supports `verbose_json`, which includes the clip duration we need for the
 * words-per-minute metric; newer transcribe models only return plain JSON, in which case
 * the pace metric is simply omitted for that turn.
 */
export const openaiWhisperStt = {
  name: 'openaiStt',

  isConfigured: () => Boolean(config.openai.apiKey),

  async run({ audio, mimeType, filename = 'answer.webm' }, { signal }) {
    const verbose = config.openai.sttModel === 'whisper-1';
    const form = new FormData();
    form.append('file', new Blob([audio], { type: mimeType || 'audio/webm' }), filename);
    form.append('model', config.openai.sttModel);
    form.append('response_format', verbose ? 'verbose_json' : 'json');

    let res;
    try {
      res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.openai.apiKey}` },
        body: form,
        signal,
      });
    } catch (err) {
      throw ProviderError.fromNetwork('openaiStt', err);
    }
    if (!res.ok) throw await ProviderError.fromResponse('openaiStt', res);

    const data = await res.json();
    return { text: (data.text ?? '').trim(), durationSec: data.duration ?? null, confidence: null };
  },
};
