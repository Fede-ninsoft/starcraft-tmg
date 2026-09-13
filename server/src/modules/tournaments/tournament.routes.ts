import { Router } from 'express';
import { z } from 'zod';
import type { ServerEnvironment } from '../../config/env.js';
import { HttpError } from '../../lib/errors.js';
import { optionalUser, requireVerifiedUser } from '../../middleware/require-user.js';
import { rateLimit } from '../../middleware/rate-limit.js';
import type { AuthRepository } from '../auth/auth.repository.js';
import type { ListRepository } from '../lists/list.repository.js';
import { tournamentStandings } from '../../../../src/engine/tournaments.js';
import { TournamentRepository } from './tournament.repository.js';
import { tournamentCommandSchema, tournamentConfigSchema } from './tournament.schema.js';
import { applyTournamentCommand, canManageTournament, createTournament, publicTournament } from './tournament.service.js';

export function createTournamentRouter(repository: TournamentRepository, auth: AuthRepository, lists: ListRepository, env: ServerEnvironment): Router {
  const router = Router();
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); res.setHeader('Referrer-Policy', 'no-referrer'); next(); });
  router.use(optionalUser(auth, env));
  router.use(rateLimit({ windowMs: 60_000, max: 120 }));
  router.get('/', async (req, res) => {
    const offset = z.coerce.number().int().min(0).max(100000).safeParse(req.query.offset ?? 0);
    if (!offset.success) throw new HttpError(400, 'INVALID_INPUT', 'Paginación no válida.');
    const period = z.enum(['all', 'current', 'past', 'future']).safeParse(req.query.period ?? 'all');
    if (!period.success) throw new HttpError(400, 'INVALID_INPUT', 'Filtro no válido.');
    const entries = await repository.list(req.authenticatedUser?.id ?? null, offset.data, period.data);
    res.json({ tournaments: entries.map((t) => ({ id: t.id, ownerId: t.ownerId, ownerName: t.ownerName, status: t.status, config: t.config, playerCount: t.players.filter((p) => p.status === 'ACTIVE').length })), nextOffset: entries.length === 25 ? offset.data + 25 : null });
  });
  router.get('/:id', async (req, res) => {
    const t = await repository.find(String(req.params.id));
    res.json({ tournament: publicTournament(t, req.authenticatedUser?.id ?? null, new Date().toISOString()), standings: tournamentStandings(t) });
  });
  router.get('/:id/audit', requireVerifiedUser, async (req, res) => {
    const t = await repository.find(String(req.params.id));
    if (!canManageTournament(t, req.authenticatedUser!.id)) throw new HttpError(403, 'TOURNAMENT_FORBIDDEN', 'Solo el organizador puede consultar el historial.');
    res.json({ audit: await repository.audit(t.id) });
  });
  router.use((req, _res, next) => {
    if (!req.authenticatedUser) return next(new HttpError(401, 'UNAUTHENTICATED', 'Inicia sesión.'));
    if (req.header('origin') !== env.APP_ORIGIN) return next(new HttpError(403, 'ORIGIN_FORBIDDEN', 'Origen no permitido.'));
    next();
  }, requireVerifiedUser);
  router.post('/', async (req, res) => {
    const config = tournamentConfigSchema.safeParse(req.body);
    if (!config.success) throw new HttpError(400, 'INVALID_INPUT', config.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' '));
    const t = createTournament(config.data, req.authenticatedUser!, new Date().toISOString());
    await repository.create(t); res.status(201).json({ tournament: publicTournament(t, req.authenticatedUser!.id, new Date().toISOString()), standings: [] });
  });
  router.post('/:id/commands', async (req, res) => {
    const command = tournamentCommandSchema.safeParse(req.body);
    const revision = z.coerce.number().int().positive().safeParse(req.header('if-match'));
    if (!command.success) throw new HttpError(400, 'INVALID_INPUT', 'Revisa los campos de la operación.');
    if (!revision.success) throw new HttpError(428, 'REVISION_REQUIRED', 'Actualiza el torneo.');
    let extra: { token?: string } = {};
    // Never persist invitation tokens in audit logs.
    const detail = command.data.type === 'JOIN' ? { type: 'JOIN', race: command.data.race } : command.data;
    const t = await repository.mutate(req.params.id, revision.data, req.authenticatedUser!.id, command.data.type, detail, async (event) => {
      extra = await applyTournamentCommand(event, command.data, req.authenticatedUser!, { lists, auth }, new Date().toISOString());
    });
    res.json({ tournament: publicTournament(t, req.authenticatedUser!.id, new Date().toISOString()), standings: tournamentStandings(t), ...extra });
  });
  return router;
}
