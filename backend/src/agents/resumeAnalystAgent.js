import { z } from 'zod';
import { completeStructured } from '../core/llm/claudeClient.js';
import { RESUME_ANALYST_SYSTEM } from './prompts.js';

const Item = z.object({
  title: z.string(),
  claims: z.array(z.string()),
  probeQuestions: z.array(z.string()),
});

export const ResumePlanSchema = z.object({
  candidateName: z.string().nullable(),
  summary: z.string(),
  introduction: z.array(z.string()),
  projects: z.array(Item),
  experience: z.array(Item),
  skills: z.array(Item),
});

/**
 * Resume analyst: runs once per session, before the first question.
 *
 * Turning the resume into a structured plan up front means the interviewer gets a short,
 * pointed brief on every turn instead of re-reading the whole resume, which keeps its
 * prompt small and its questions anchored to the candidate's real claims.
 */
export const resumeAnalystAgent = {
  name: 'resume-analyst',

  async analyze(resumeText, llm = { completeStructured }) {
    return llm.completeStructured({
      system: RESUME_ANALYST_SYSTEM,
      schema: ResumePlanSchema,
      effort: 'medium',
      messages: [{ role: 'user', content: `Resume:\n\n${resumeText}` }],
    });
  },

  /** Compact text rendering of the plan for the interviewer's system prompt. */
  toBrief(plan) {
    if (!plan) return '';
    const section = (label, items) => items.length
      ? `${label}:\n${items.map((i) => `- ${i.title}. Claims: ${i.claims.join('; ')}. Probe: ${i.probeQuestions.join(' / ')}`).join('\n')}`
      : '';
    return [
      plan.summary && `Summary: ${plan.summary}`,
      plan.introduction.length && `Introduction points: ${plan.introduction.join('; ')}`,
      section('Projects', plan.projects),
      section('Experience', plan.experience),
      section('Skills', plan.skills),
    ].filter(Boolean).join('\n\n');
  },
};
