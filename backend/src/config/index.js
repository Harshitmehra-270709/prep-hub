/**
 * Central runtime configuration.
 *
 * Every secret and tunable is read from process.env exactly once, here, so the rest
 * of the codebase never touches the environment directly. `npm start` loads a `.env`
 * file from the backend root if one exists (Node's --env-file-if-exists); otherwise the
 * variables come from the shell or the hosting platform.
 *
 * Providers whose key is missing are reported as "not configured" by /api/health and
 * skipped by the provider chains, so the server boots with any subset of keys.
 */

const env = process.env;

const int = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const list = (value, fallback) =>
  value ? value.split(',').map((s) => s.trim()).filter(Boolean) : fallback;

export const config = Object.freeze({
  env: env.NODE_ENV ?? 'development',
  port: int(env.PORT, 8080),
  // The static frontend is served by `python -m http.server 5500` during development.
  corsOrigins: list(env.CORS_ORIGINS, ['http://localhost:5500', 'http://127.0.0.1:5500']),

  anthropic: Object.freeze({
    apiKey: env.ANTHROPIC_API_KEY,
    model: env.CLAUDE_MODEL ?? 'claude-opus-5-5',
  }),

  openai: Object.freeze({
    apiKey: env.OPENAI_API_KEY,
    sttModel: env.OPENAI_STT_MODEL ?? 'whisper-1',
    ttsModel: env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts',
    ttsVoice: env.OPENAI_TTS_VOICE ?? 'alloy',
  }),

  deepgram: Object.freeze({
    apiKey: env.DEEPGRAM_API_KEY,
    model: env.DEEPGRAM_MODEL ?? 'nova-3',
  }),

  elevenlabs: Object.freeze({
    apiKey: env.ELEVENLABS_API_KEY,
    voiceId: env.ELEVENLABS_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM',
    modelId: env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2',
  }),

  // Per-provider token buckets. Defaults sit comfortably under each vendor's free/
  // starter tier so a burst of interviews degrades to the fallback provider instead of
  // collecting 429s.
  rateLimits: Object.freeze({
    anthropic: { capacity: int(env.RL_ANTHROPIC_BURST, 10), refillPerSecond: int(env.RL_ANTHROPIC_RPM, 50) / 60 },
    deepgram: { capacity: int(env.RL_DEEPGRAM_BURST, 10), refillPerSecond: int(env.RL_DEEPGRAM_RPM, 100) / 60 },
    openaiStt: { capacity: int(env.RL_OPENAI_STT_BURST, 5), refillPerSecond: int(env.RL_OPENAI_STT_RPM, 50) / 60 },
    elevenlabs: { capacity: int(env.RL_ELEVENLABS_BURST, 5), refillPerSecond: int(env.RL_ELEVENLABS_RPM, 60) / 60 },
    openaiTts: { capacity: int(env.RL_OPENAI_TTS_BURST, 5), refillPerSecond: int(env.RL_OPENAI_TTS_RPM, 50) / 60 },
    // Inbound limit per client IP across the whole API.
    client: { capacity: int(env.RL_CLIENT_BURST, 30), refillPerSecond: int(env.RL_CLIENT_RPM, 120) / 60 },
  }),

  providerTimeoutMs: int(env.PROVIDER_TIMEOUT_MS, 30_000),
  maxAudioBytes: int(env.MAX_AUDIO_MB, 25) * 1024 * 1024,

  interview: Object.freeze({
    maxQuestions: int(env.INTERVIEW_MAX_QUESTIONS, 8),
    sessionTtlMs: int(env.SESSION_TTL_MINUTES, 120) * 60_000,
  }),
});

/** Which providers have credentials. Exposed by /api/health; never includes the keys. */
export function providerStatus() {
  return {
    anthropic: Boolean(config.anthropic.apiKey),
    openai: Boolean(config.openai.apiKey),
    deepgram: Boolean(config.deepgram.apiKey),
    elevenlabs: Boolean(config.elevenlabs.apiKey),
  };
}
