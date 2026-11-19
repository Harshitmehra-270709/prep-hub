import { complete } from '../core/llm/claudeClient.js';
import { interviewerSystem } from './prompts.js';

const OPENING_CUE = 'The candidate has joined the call. Greet them briefly and ask your first question.';
const CLOSING_LINE = "That's all the questions I have. Thank you for your time — your report is being prepared now.";

/**
 * Interviewer: produces the next spoken question from the conversation so far.
 *
 * The transcript maps naturally onto the Messages API: interviewer turns become
 * `assistant` messages and candidate answers become `user` messages, preceded by a fixed
 * opening cue so the conversation always starts with a user turn. Effort stays at
 * "medium": this runs on every turn of a live voice call, where latency is felt directly.
 */
export const interviewerAgent = {
  name: 'interviewer',

  closingLine: CLOSING_LINE,

  async nextQuestion(session, llm = { complete }) {
    const messages = [{ role: 'user', content: OPENING_CUE }];
    for (const turn of session.turns) {
      messages.push({ role: turn.role === 'interviewer' ? 'assistant' : 'user', content: turn.text });
    }

    const { text, usage } = await llm.complete({
      system: interviewerSystem({
        mode: session.mode,
        plan: session.brief,
        role: session.role,
        track: session.track,
        topics: session.topics,
        maxQuestions: session.maxQuestions,
        questionsAsked: session.questionsAsked,
      }),
      messages,
      maxTokens: 2_000,
      effort: 'medium',
    });
    return { text, usage };
  },
};
