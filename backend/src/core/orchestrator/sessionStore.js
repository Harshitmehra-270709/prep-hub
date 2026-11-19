import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../../lib/errors.js';

/**
 * In-memory interview session store with idle expiry.
 *
 * Sessions are short-lived (one ~15 minute interview) and losing one on restart only
 * costs the candidate a retake, so memory is the right trade for a single instance. The
 * interface (create/get/save/delete) is deliberately what a Redis-backed store would
 * expose, so scaling out is a drop-in swap rather than a refactor.
 */
export class SessionStore {
  constructor({ ttlMs, sweepEveryMs = 60_000, now = () => Date.now() } = {}) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.sessions = new Map();
    // unref(): the sweeper must never be the thing keeping the process alive.
    this.sweeper = setInterval(() => this.sweep(), sweepEveryMs);
    this.sweeper.unref?.();
  }

  create(fields) {
    const session = { id: randomUUID(), createdAt: new Date(this.now()).toISOString(), status: 'active', turns: [], ...fields };
    this.save(session);
    return session;
  }

  get(id) {
    const entry = this.sessions.get(id);
    if (!entry || this.now() - entry.touchedAt > this.ttlMs) {
      this.sessions.delete(id);
      throw new NotFoundError('Interview session not found or expired');
    }
    entry.touchedAt = this.now();
    return entry.session;
  }

  save(session) {
    this.sessions.set(session.id, { session, touchedAt: this.now() });
  }

  delete(id) {
    this.sessions.delete(id);
  }

  sweep() {
    const cutoff = this.now() - this.ttlMs;
    for (const [id, entry] of this.sessions) {
      if (entry.touchedAt < cutoff) this.sessions.delete(id);
    }
  }

  get size() {
    return this.sessions.size;
  }

  close() {
    clearInterval(this.sweeper);
  }
}
