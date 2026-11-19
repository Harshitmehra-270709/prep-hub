import { z } from 'zod';
import { completeStructured } from '../core/llm/claudeClient.js';
import { EVALUATOR_SYSTEM } from './prompts.js';

/**
 * Report schema. Mirrors the sample report the frontend renders (sample-report.html), so
 * a finished session can be displayed with the same components.
 */
export const ReportSchema = z.object({
  verdict: z.enum(['Ready', 'Almost there', 'Not ready']),
  headline: z.string(),
  summary: z.string(),
  oneLine: z.string(),
  communicationScore: z.number().int(),
  scoreNote: z.string(),
  metrics: z.array(z.object({ name: z.string(), score: z.number().int(), note: z.string() })),
  tip: z.string(),
  areas: z.array(z.object({ name: z.string(), questions: z.number().int(), summary: z.string() })),
  fixes: z.array(z.object({ fix: z.string(), why: z.string() })),
});

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Evaluator: runs once, after the last answer. Uses high effort because this is the one
 * call whose quality the candidate actually reads, and it is not latency-sensitive.
 */
export const evaluatorAgent = {
  name: 'evaluator',

  async evaluate(session, delivery, llm = { completeStructured }) {
    const transcript = session.turns
      .map((t) => `${t.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${t.text}`)
      .join('\n');

    const report = await llm.completeStructured({
      system: EVALUATOR_SYSTEM,
      schema: ReportSchema,
      effort: 'high',
      messages: [{
        role: 'user',
        content: `Interview type: ${session.mode}${session.role ? ` (${session.role})` : ''}

Delivery metrics (measured):
${JSON.stringify(delivery, null, 2)}

Transcript:
${transcript}`,
      }],
    });

    // Enforce numeric ranges and the three-fix contract locally; the schema keeps the
    // shape strict, these keep the values inside what the UI is designed to show.
    return {
      ...report,
      communicationScore: clamp(report.communicationScore),
      metrics: report.metrics.map((m) => ({ ...m, score: clamp(m.score) })),
      fixes: report.fixes.slice(0, 3),
      delivery,
    };
  },
};
