import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { config } from '../../config/index.js';
import { ProviderError } from '../../lib/errors.js';
import { TokenBucket } from '../resilience/tokenBucket.js';

/**
 * Thin wrapper around the Anthropic SDK used by every agent.
 *
 * - The client is created lazily so the server can boot (and serve health/speech routes)
 *   before ANTHROPIC_API_KEY is provided.
 * - Transient HTTP failures are retried by the SDK itself (maxRetries), so we do not wrap
 *   these calls in our own retry and double the attempts.
 * - A local token bucket keeps a burst of concurrent interviews under the account's rate
 *   limit; requests queue briefly rather than collect 429s.
 * - Conversational calls opt into server-side refusal fallbacks ("default" routing), so a
 *   safety decline on the primary model is re-run on a fallback model inside the same call.
 */

let client;
const bucket = new TokenBucket(config.rateLimits.anthropic);

function claude() {
  if (!config.anthropic.apiKey) {
    throw new ProviderError('ANTHROPIC_API_KEY is not set', { provider: 'anthropic', status: 503 });
  }
  client ??= new Anthropic({ apiKey: config.anthropic.apiKey, maxRetries: 2 });
  return client;
}

/** Converts SDK exceptions into our ProviderError so routes answer with a sensible status. */
function wrap(err) {
  if (err instanceof ProviderError) return err;
  if (err instanceof Anthropic.RateLimitError) {
    return new ProviderError('Claude rate limit reached', { provider: 'anthropic', status: 429, retryable: true, cause: err });
  }
  if (err instanceof Anthropic.AuthenticationError) {
    return new ProviderError('Claude rejected the API key', { provider: 'anthropic', status: 502, cause: err });
  }
  if (err instanceof Anthropic.BadRequestError) {
    return new ProviderError(`Claude rejected the request: ${err.message}`, { provider: 'anthropic', status: 502, cause: err });
  }
  if (err instanceof Anthropic.APIError) {
    return new ProviderError(`Claude API error ${err.status ?? ''}: ${err.message}`, { provider: 'anthropic', status: 502, retryable: true, cause: err });
  }
  return new ProviderError(`Claude call failed: ${err.message}`, { provider: 'anthropic', cause: err });
}

function assertNotRefused(response) {
  if (response.stop_reason === 'refusal') {
    const category = response.stop_details?.category ?? 'unspecified';
    throw new ProviderError(`Claude declined the request (category: ${category})`, { provider: 'anthropic', status: 422 });
  }
}

/**
 * Free-text completion: interviewer questions, coaching lines.
 * Returns the concatenated text blocks plus usage for cost logging.
 */
export async function complete({ system, messages, maxTokens = 16_000, effort = 'medium' }) {
  await bucket.take(1, { maxWaitMs: 5_000 });
  let response;
  try {
    response = await claude().beta.messages.create({
      model: config.anthropic.model,
      max_tokens: maxTokens,
      system,
      messages,
      output_config: { effort },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    });
  } catch (err) {
    throw wrap(err);
  }
  assertNotRefused(response);
  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
  return { text, model: response.model, usage: response.usage };
}

/**
 * Schema-constrained completion: resume analysis and the final report.
 * Structured outputs guarantee the JSON matches the Zod schema, so callers receive a
 * typed object and never parse model prose.
 */
export async function completeStructured({ system, messages, schema, maxTokens = 16_000, effort = 'high' }) {
  await bucket.take(1, { maxWaitMs: 5_000 });
  let response;
  try {
    response = await claude().messages.parse({
      model: config.anthropic.model,
      max_tokens: maxTokens,
      system,
      messages,
      output_config: { effort, format: zodOutputFormat(schema) },
    });
  } catch (err) {
    throw wrap(err);
  }
  assertNotRefused(response);
  if (!response.parsed_output) {
    throw new ProviderError(`Claude returned output that did not match the schema (stop_reason: ${response.stop_reason})`, {
      provider: 'anthropic',
      status: 502,
    });
  }
  return response.parsed_output;
}

export function llmStatus() {
  return { provider: 'anthropic', model: config.anthropic.model, configured: Boolean(config.anthropic.apiKey), rateLimit: bucket.snapshot() };
}
