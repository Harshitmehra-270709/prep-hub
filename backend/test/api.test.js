process.env.NODE_ENV = 'test';

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { ProviderChain } from '../src/core/resilience/providerChain.js';
import { ProviderError } from '../src/lib/errors.js';

/*
 * End-to-end over real HTTP with the real orchestrator, middleware and provider chains.
 * Only the leaves are stubbed: LLM agents return canned output and speech providers are
 * in-process fakes, so the suite needs no network and no API keys.
 */

const agents = {
  resumeAnalyst: {
    analyze: async () => ({ candidateName: 'Asha', summary: 'CS student', introduction: [], projects: [], experience: [], skills: [] }),
    toBrief: (plan) => (plan ? `Summary: ${plan.summary}` : ''),
  },
  interviewer: {
    closingLine: 'Thanks, that is all.',
    nextQuestion: async (session) => ({ text: `Question ${session.questionsAsked + 1}?`, usage: {} }),
  },
  evaluator: {
    evaluate: async (_session, delivery) => ({ verdict: 'Almost there', communicationScore: 70, fixes: [], delivery }),
  },
};

const fake = (name, impl) => ({ name, isConfigured: () => true, run: impl });

const stt = new ProviderChain('speech-to-text', [
  fake('primary-stt', async () => { throw new ProviderError('down', { retryable: false }); }),
  fake('backup-stt', async ({ audio }) => ({ text: `um ${audio.toString()}`, durationSec: 3 })),
]);
const tts = new ProviderChain('text-to-speech', [
  fake('fake-tts', async ({ text }) => ({ audio: Buffer.from(`mp3:${text}`), mimeType: 'audio/mpeg' })),
]);

let server;
let base;

before(async () => {
  const { app } = createApp({ agents, stt, tts, maxQuestions: 2, clientRateLimit: { capacity: 100, refillPerSecond: 100 } });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(() => new Promise((resolve) => server.close(resolve)));

const post = (path, body) => fetch(`${base}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('health reports provider chains', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.deepEqual(body.speechToText.map((p) => p.provider), ['primary-stt', 'backup-stt']);
});

test('resume interview requires resume text', async () => {
  const res = await post('/interview/sessions', { mode: 'resume' });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error.code, 'invalid_request');
});

test('full interview: start with voice, answer by audio and text, close, then report', async () => {
  const start = await post('/interview/sessions', { mode: 'resume', resumeText: 'Built a RAG app', voice: true });
  assert.equal(start.status, 201);
  const s = await start.json();
  assert.equal(s.question, 'Question 1?');
  assert.equal(s.audio.mimeType, 'audio/mpeg');
  assert.equal(Buffer.from(s.audio.base64, 'base64').toString(), 'mp3:Question 1?');

  // Spoken answer: primary STT fails, the chain falls back to the backup transparently.
  const form = new FormData();
  form.append('audio', new Blob([Buffer.from('my answer')], { type: 'audio/webm' }), 'a.webm');
  const turn1 = await (await fetch(`${base}/interview/sessions/${s.session.id}/turns`, { method: 'POST', body: form })).json();
  assert.equal(turn1.transcript, 'um my answer');
  assert.equal(turn1.transcribedBy, 'backup-stt');
  assert.equal(turn1.question, 'Question 2?');
  assert.equal(turn1.done, false);

  // Typed answer after the last question closes the interview.
  const turn2 = await (await post(`/interview/sessions/${s.session.id}/turns`, { text: 'basically done' })).json();
  assert.equal(turn2.done, true);
  assert.equal(turn2.session.status, 'awaiting_report');

  const late = await post(`/interview/sessions/${s.session.id}/turns`, { text: 'one more' });
  assert.equal(late.status, 409);

  const report = await (await post(`/interview/sessions/${s.session.id}/report`)).json();
  assert.equal(report.verdict, 'Almost there');
  assert.equal(report.delivery.answers, 2);
  assert.equal(report.delivery.fillerCount, 2);
  assert.equal(report.delivery.wordsPerMinute, 60); // 3 words over 3 timed seconds

  const view = await (await fetch(`${base}/interview/sessions/${s.session.id}`)).json();
  assert.equal(view.status, 'completed');
  assert.equal(view.turns.length, 5);
});

test('unknown session returns 404', async () => {
  const res = await fetch(`${base}/interview/sessions/does-not-exist`);
  assert.equal(res.status, 404);
});

test('synthesize returns raw audio with the serving provider', async () => {
  const res = await post('/speech/synthesize', { text: 'Hello' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'audio/mpeg');
  assert.equal(res.headers.get('x-speech-provider'), 'fake-tts');
  assert.equal(Buffer.from(await res.arrayBuffer()).toString(), 'mp3:Hello');
});
