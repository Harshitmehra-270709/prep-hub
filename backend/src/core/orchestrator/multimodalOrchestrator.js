import { AppError, ValidationError } from '../../lib/errors.js';
import { logger } from '../../lib/logger.js';
import { summarizeDelivery } from '../analysis/speechMetrics.js';
import { TTS_MAX_CHARS } from '../speech/tts/index.js';

/**
 * Multimodal interview orchestrator.
 *
 * Owns the lifecycle of one interview and is the only component that knows the order of
 * operations; agents and speech providers stay single-purpose and unaware of each other.
 *
 *   start   -> [resume analyst] -> interviewer question -> [TTS]
 *   turn    -> [STT] -> record answer + timing -> interviewer question | closing -> [TTS]
 *   finish  -> local delivery metrics -> evaluator report
 *
 * Voice is an enhancement, not a dependency: if every TTS provider fails, the turn still
 * succeeds with text and a `degraded` flag, so a speech outage never blocks an interview.
 * STT failure, by contrast, is surfaced to the client: without the answer there is
 * nothing to continue from, and the candidate can re-record or type instead.
 */
export class MultimodalOrchestrator {
  constructor({ store, stt, tts, agents, maxQuestions }) {
    this.store = store;
    this.stt = stt;
    this.tts = tts;
    this.agents = agents;
    this.maxQuestions = maxQuestions;
  }

  async startSession({ mode = 'resume', resumeText, role, track, topics = [], voice = false }) {
    if (mode === 'resume' && !resumeText?.trim()) {
      throw new ValidationError('resumeText is required for a resume interview');
    }

    let plan = null;
    if (resumeText?.trim()) {
      plan = await this.agents.resumeAnalyst.analyze(resumeText);
    }

    const session = this.store.create({
      mode,
      role,
      track,
      topics,
      voice,
      plan,
      brief: this.agents.resumeAnalyst.toBrief(plan),
      maxQuestions: this.maxQuestions,
      questionsAsked: 0,
    });

    const question = await this.#ask(session);
    return { session: this.#publicView(session), ...question };
  }

  async submitTurn(sessionId, { text, audio, mimeType, filename }) {
    const session = this.store.get(sessionId);
    if (session.status !== 'active') {
      throw new AppError('This interview has already ended', { status: 409, code: 'session_closed' });
    }

    let answer = text?.trim();
    let durationSec = null;
    let transcribedBy = null;
    if (audio?.length) {
      const { provider, result } = await this.stt.run({ audio, mimeType, filename });
      answer = result.text;
      durationSec = result.durationSec;
      transcribedBy = provider;
    }
    if (!answer) throw new ValidationError('Send either a non-empty text answer or an audio recording');

    session.turns.push({ role: 'candidate', text: answer, durationSec, at: new Date().toISOString() });

    if (session.questionsAsked >= session.maxQuestions) {
      session.status = 'awaiting_report';
      session.turns.push({ role: 'interviewer', text: this.agents.interviewer.closingLine, at: new Date().toISOString() });
      this.store.save(session);
      const speech = await this.#speak(session, this.agents.interviewer.closingLine);
      return { session: this.#publicView(session), transcript: answer, transcribedBy, question: null, done: true, ...speech };
    }

    const question = await this.#ask(session);
    return { session: this.#publicView(session), transcript: answer, transcribedBy, done: false, ...question };
  }

  async finish(sessionId) {
    const session = this.store.get(sessionId);
    if (session.report) return session.report;
    if (!session.turns.some((t) => t.role === 'candidate')) {
      throw new ValidationError('The candidate has not answered any questions yet');
    }

    const delivery = summarizeDelivery(session.turns);
    session.report = await this.agents.evaluator.evaluate(session, delivery);
    session.status = 'completed';
    this.store.save(session);
    logger.info('interview completed', { sessionId, verdict: session.report.verdict, answers: delivery.answers });
    return session.report;
  }

  getSession(sessionId) {
    const session = this.store.get(sessionId);
    return { ...this.#publicView(session), turns: session.turns, report: session.report ?? null };
  }

  async synthesize(text) {
    if (!text?.trim()) throw new ValidationError('text is required');
    if (text.length > TTS_MAX_CHARS) throw new ValidationError(`text must be at most ${TTS_MAX_CHARS} characters`);
    const { provider, result } = await this.tts.run({ text });
    return { provider, ...result };
  }

  async transcribe({ audio, mimeType, filename }) {
    if (!audio?.length) throw new ValidationError('audio is required');
    const { provider, result } = await this.stt.run({ audio, mimeType, filename });
    return { provider, ...result };
  }

  async #ask(session) {
    const { text, usage } = await this.agents.interviewer.nextQuestion(session);
    session.questionsAsked += 1;
    session.turns.push({ role: 'interviewer', text, at: new Date().toISOString() });
    this.store.save(session);
    logger.debug('question asked', { sessionId: session.id, n: session.questionsAsked, outputTokens: usage?.output_tokens });
    const speech = await this.#speak(session, text);
    return { question: text, questionNumber: session.questionsAsked, ...speech };
  }

  async #speak(session, text) {
    if (!session.voice) return { audio: null };
    try {
      const { provider, result } = await this.tts.run({ text: text.slice(0, TTS_MAX_CHARS) });
      return { audio: { mimeType: result.mimeType, base64: result.audio.toString('base64'), provider } };
    } catch (err) {
      logger.warn('tts unavailable, continuing with text only', { sessionId: session.id, error: err.message });
      return { audio: null, degraded: 'voice_unavailable' };
    }
  }

  #publicView(session) {
    const { id, mode, role, track, status, questionsAsked, maxQuestions, createdAt } = session;
    return { id, mode, role, track, status, questionsAsked, maxQuestions, createdAt };
  }
}
