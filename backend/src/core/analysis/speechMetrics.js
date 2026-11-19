/**
 * Deterministic delivery metrics computed from transcripts.
 *
 * These are counted locally rather than asked of the LLM: counting is exact, free and
 * reproducible, and the evaluator then interprets the numbers instead of estimating
 * them. Multi-word fillers are matched before single words so "you know" is not also
 * counted as two unrelated tokens.
 */

const FILLERS = ['you know', 'i mean', 'kind of', 'sort of', 'um', 'uh', 'erm', 'hmm', 'basically', 'actually', 'literally', 'like', 'so'];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function countFillers(text) {
  let remaining = ` ${text.toLowerCase()} `;
  const counts = {};
  for (const filler of FILLERS) {
    const re = new RegExp(`(?<=[\\s,.!?])${escape(filler)}(?=[\\s,.!?])`, 'g');
    const hits = remaining.match(re)?.length ?? 0;
    if (hits) {
      counts[filler] = hits;
      remaining = remaining.replace(re, ' ');
    }
  }
  return counts;
}

export function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/**
 * Aggregates candidate turns into session-level numbers for the report.
 * Turns without a duration (typed answers, or STT providers that do not return one)
 * contribute to filler counts but are excluded from pace, so pace is never skewed by them.
 */
export function summarizeDelivery(turns) {
  const answers = turns.filter((t) => t.role === 'candidate');
  const fillerTotals = {};
  let words = 0;
  let timedWords = 0;
  let timedFillers = 0;
  let seconds = 0;

  for (const turn of answers) {
    const w = wordCount(turn.text);
    const fillers = countFillers(turn.text);
    const turnFillers = Object.values(fillers).reduce((a, b) => a + b, 0);
    words += w;
    for (const [filler, n] of Object.entries(fillers)) {
      fillerTotals[filler] = (fillerTotals[filler] ?? 0) + n;
    }
    if (turn.durationSec > 0) {
      seconds += turn.durationSec;
      timedWords += w;
      timedFillers += turnFillers;
    }
  }

  const fillerCount = Object.values(fillerTotals).reduce((a, b) => a + b, 0);
  const minutes = seconds / 60;
  const topFillers = Object.entries(fillerTotals).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f]) => f);

  return {
    answers: answers.length,
    words,
    spokenSeconds: Math.round(seconds),
    wordsPerMinute: minutes > 0 ? Math.round(timedWords / minutes) : null,
    fillerCount,
    fillersPerMinute: minutes > 0 ? Math.round((timedFillers / minutes) * 10) / 10 : null,
    topFillers,
  };
}
