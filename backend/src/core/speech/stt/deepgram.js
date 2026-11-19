import { config } from '../../../config/index.js';
import { ProviderError } from '../../../lib/errors.js';

/**
 * Deepgram pre-recorded transcription (primary STT).
 *
 * Preferred for interviews because `filler_words=true` keeps "uh"/"um" in the transcript,
 * and filler density is one of the delivery metrics in the candidate's report. Whisper
 * tends to clean those up, which flatters the candidate.
 */
export const deepgramStt = {
  name: 'deepgram',

  isConfigured: () => Boolean(config.deepgram.apiKey),

  async run({ audio, mimeType }, { signal }) {
    const url = new URL('https://api.deepgram.com/v1/listen');
    url.searchParams.set('model', config.deepgram.model);
    url.searchParams.set('smart_format', 'true');
    url.searchParams.set('punctuate', 'true');
    url.searchParams.set('filler_words', 'true');

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Token ${config.deepgram.apiKey}`, 'Content-Type': mimeType || 'audio/webm' },
        body: audio,
        signal,
      });
    } catch (err) {
      throw ProviderError.fromNetwork('deepgram', err);
    }
    if (!res.ok) throw await ProviderError.fromResponse('deepgram', res);

    const data = await res.json();
    const alt = data?.results?.channels?.[0]?.alternatives?.[0];
    return {
      text: (alt?.transcript ?? '').trim(),
      durationSec: data?.metadata?.duration ?? null,
      confidence: alt?.confidence ?? null,
    };
  },
};
