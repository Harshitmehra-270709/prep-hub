# Prep Hub — Backend

Voice mock-interview backend for the Prep Hub frontend. A candidate speaks their answers, the
backend transcribes them, a Claude-powered interviewer asks follow-up questions out loud, and
at the end an evaluator writes a report in the same shape as `sample-report.html`.

## Architecture

```
            ┌──────────────── HTTP (Express 5) ────────────────┐
            │  /api/interview/*   /api/speech/*   /api/health  │
            │  per-client rate limit · CORS · validation       │
            └──────────────────────┬───────────────────────────┘
                                   │
                    MultimodalOrchestrator (session lifecycle)
                 ┌─────────────┬───┴──────────┬───────────────┐
                 │             │              │               │
          Resume analyst   Interviewer    Evaluator     Speech metrics
           (structured)     (per turn)   (structured)   (local, exact)
                 └──────┬──────┴──────┬───────┘
                        │             │
                   Claude client   Speech provider chains
                (token bucket,     STT: Deepgram → OpenAI Whisper
                 refusal fallback) TTS: ElevenLabs → OpenAI TTS
                                   (each: rate limit · circuit breaker · retry)
```

| Path | Responsibility |
|---|---|
| `src/core/resilience/` | `TokenBucket`, `withRetry` (exponential backoff + full jitter), `CircuitBreaker`, and `ProviderChain`, which combines them into ordered fallback across providers |
| `src/core/speech/stt/` | Speech-to-text providers and their chain |
| `src/core/speech/tts/` | Text-to-speech providers and their chain |
| `src/core/llm/claudeClient.js` | Claude calls: free text (interviewer) and schema-validated JSON (analyst, evaluator) |
| `src/core/analysis/speechMetrics.js` | Filler words, words per minute: computed exactly, then handed to the evaluator |
| `src/core/orchestrator/` | Interview lifecycle and the session store |
| `src/agents/` | The three agents and their prompts |
| `src/http/` | Routes and middleware |

### Design notes

- **Voice degrades, it doesn't fail.** If every TTS provider is down, turns still succeed with
  text and `degraded: "voice_unavailable"`. STT failures are returned to the client, since there
  is no answer to continue from.
- **Measured, not estimated.** Delivery metrics are counted locally from the transcript and
  audio duration; the LLM interprets them rather than guessing them.
- **Two kinds of rate limit.** Per-provider buckets protect vendor quotas and trigger fallback;
  the per-IP bucket protects the paid APIs from one noisy client.
- **Sessions live in memory.** `SessionStore` exposes the same interface a Redis store would,
  so running more than one instance means swapping that one class.

## Setup

Requires Node 22.9 or newer.

```bash
cd backend
npm install
npm test        # runs offline: no API keys needed
npm start       # http://localhost:8080
```

### Environment variables

`npm start` loads a `.env` file from this folder if one exists. No `.env` is committed; create
one yourself or export the variables in your shell. Any provider without a key is skipped, and
`GET /api/health` shows which ones are active.

| Variable | Used for | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Interviewer, resume analyst and evaluator (Claude) | Yes, for interviews |
| `DEEPGRAM_API_KEY` | Primary speech-to-text | One STT key for voice answers |
| `OPENAI_API_KEY` | Fallback speech-to-text and text-to-speech | Optional |
| `ELEVENLABS_API_KEY` | Primary text-to-speech | One TTS key for spoken questions |
| `ELEVENLABS_VOICE_ID` | Interviewer voice (defaults to a stock voice) | Optional |
| `CLAUDE_MODEL` | Defaults to `claude-opus-5-5` | Optional |
| `PORT`, `CORS_ORIGINS` | Defaults `8080` and the local frontend origins | Optional |
| `INTERVIEW_MAX_QUESTIONS` | Questions per interview, default `8` | Optional |
| `RL_*_RPM`, `RL_*_BURST` | Rate-limit tuning; see `src/config/index.js` | Optional |

## API

| Method | Path | Body | Returns |
|---|---|---|---|
| `GET` | `/api/health` | | Provider configuration, breaker states, remaining rate budget |
| `POST` | `/api/interview/sessions` | `{ mode: "resume"\|"role"\|"skill", resumeText?, role?, track?, topics?, voice? }` | Session and first question (plus base64 MP3 when `voice`) |
| `POST` | `/api/interview/sessions/:id/turns` | multipart field `audio`, or JSON `{ text }` | Transcript, next question (or `done: true`) |
| `POST` | `/api/interview/sessions/:id/report` | | Final report |
| `GET` | `/api/interview/sessions/:id` | | Session, full transcript and report if ready |
| `POST` | `/api/speech/transcribe` | multipart field `audio` | `{ provider, text, durationSec }` |
| `POST` | `/api/speech/synthesize` | `{ text }` | `audio/mpeg` body, `X-Speech-Provider` header |

Example:

```bash
curl -X POST localhost:8080/api/interview/sessions \
  -H "Content-Type: application/json" \
  -d '{"mode":"role","role":"Backend Developer","track":"Java","topics":["OOP","DBMS","REST APIs"]}'
```
