process.env.NODE_ENV = 'test';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countFillers, summarizeDelivery } from '../src/core/analysis/speechMetrics.js';

test('counts single- and multi-word fillers without double counting', () => {
  const counts = countFillers('So, um, I basically built it, you know, and uh, like, it worked. So yeah.');
  assert.deepEqual(counts, { 'you know': 1, um: 1, uh: 1, basically: 1, like: 1, so: 2 });
});

test('does not match fillers inside other words', () => {
  assert.deepEqual(countFillers('Also the umbrella likes sorting'), {});
});

test('summarizes delivery and only uses timed turns for pace', () => {
  const summary = summarizeDelivery([
    { role: 'interviewer', text: 'Tell me about yourself.' },
    { role: 'candidate', text: 'um I am a final year student who likes building things', durationSec: 6 },
    { role: 'interviewer', text: 'What did you build?' },
    { role: 'candidate', text: 'basically a typed answer with no timing' },
  ]);
  assert.equal(summary.answers, 2);
  assert.equal(summary.fillerCount, 2);
  assert.equal(summary.spokenSeconds, 6);
  assert.equal(summary.wordsPerMinute, 110); // 11 words in 6 s
  assert.equal(summary.fillersPerMinute, 10); // 1 timed filler over 0.1 min; the typed answer's filler is excluded
});
