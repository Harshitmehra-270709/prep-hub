import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { validateBody } from './middleware.js';

const StartSessionBody = z.object({
  mode: z.enum(['resume', 'role', 'skill']).default('resume'),
  resumeText: z.string().max(30_000).optional(),
  role: z.string().max(80).optional(),
  track: z.string().max(40).optional(),
  topics: z.array(z.string().max(80)).max(20).default([]),
  voice: z.boolean().default(false),
});

const SynthesizeBody = z.object({ text: z.string().min(1) });

/**
 * HTTP surface. Handlers are deliberately thin: parse the request, call the orchestrator,
 * shape the response. Express 5 forwards rejected promises to the error handler, so no
 * try/catch boilerplate is needed here.
 */
export function createRoutes({ orchestrator, health, maxAudioBytes }) {
  const router = Router();
  // Audio stays in memory: clips are a few MB and go straight to the STT provider, so
  // writing them to disk would only add I/O and a cleanup obligation.
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxAudioBytes, files: 1 } });

  router.get('/health', (_req, res) => res.json(health()));

  // ---- interview sessions ----
  router.post('/interview/sessions', validateBody(StartSessionBody), async (req, res) => {
    res.status(201).json(await orchestrator.startSession(req.body));
  });

  router.get('/interview/sessions/:id', (req, res) => {
    res.json(orchestrator.getSession(req.params.id));
  });

  // Accepts multipart (field "audio") for spoken answers, or JSON { text } for typed ones.
  router.post('/interview/sessions/:id/turns', upload.single('audio'), async (req, res) => {
    res.json(await orchestrator.submitTurn(req.params.id, {
      text: typeof req.body?.text === 'string' ? req.body.text : undefined,
      audio: req.file?.buffer,
      mimeType: req.file?.mimetype,
      filename: req.file?.originalname,
    }));
  });

  router.post('/interview/sessions/:id/report', async (req, res) => {
    res.json(await orchestrator.finish(req.params.id));
  });

  // ---- standalone speech utilities ----
  router.post('/speech/transcribe', upload.single('audio'), async (req, res) => {
    res.json(await orchestrator.transcribe({ audio: req.file?.buffer, mimeType: req.file?.mimetype, filename: req.file?.originalname }));
  });

  // Returns raw audio so the browser can play the response body directly.
  router.post('/speech/synthesize', validateBody(SynthesizeBody), async (req, res) => {
    const { provider, audio, mimeType } = await orchestrator.synthesize(req.body.text);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('X-Speech-Provider', provider);
    res.send(audio);
  });

  return router;
}
