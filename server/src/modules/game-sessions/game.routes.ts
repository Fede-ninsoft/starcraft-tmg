import { randomUUID } from 'node:crypto';
import { Router, type Request } from 'express';
import { z } from 'zod';
import type { ServerEnvironment } from '../../config/env.js';
import { HttpError } from '../../lib/errors.js';
import { optionalUser, requireVerifiedUser } from '../../middleware/require-user.js';
import type { AuthRepository } from '../auth/auth.repository.js';
import { commandSchema, createGameSchema, linkListSchema } from './game.schema.js';
import type { GamePrincipal } from './game.repository.js';
import { GameRepository } from './game.repository.js';

export const GAME_GUEST_COOKIE = 'sctmg_game_guest';

declare global {
  namespace Express {
    interface Request {
      gamePrincipal?: GamePrincipal;
    }
  }
}

function expectedRevision(request: Request): number {
  const value = z.coerce.number().int().positive().safeParse(request.header('if-match'));
  if (!value.success) throw new HttpError(428, 'REVISION_REQUIRED', 'Incluye la revisión actual de la partida.');
  return value.data;
}

function requirePrincipal(request: Request): GamePrincipal {
  if (!request.gamePrincipal) throw new HttpError(401, 'UNAUTHENTICATED', 'No se pudo resolver el propietario de la partida.');
  return request.gamePrincipal;
}

export function createGameRouter(repository: GameRepository, authRepository: AuthRepository, env: ServerEnvironment): Router {
  const router = Router();
  router.use(optionalUser(authRepository, env));

  // Compatibilidad: una cuenta autenticada puede reclamar partidas invitadas
  // creadas por versiones anteriores, pero ya no se crean identidades nuevas.
  router.get('/guest', requireVerifiedUser, async (request, response) => {
    const token = request.cookies?.[GAME_GUEST_COOKIE];
    if (typeof token !== 'string') { response.json({ games: [] }); return; }
    const guestId = await repository.ensureGuest(token);
    response.json({ games: await repository.list({ type: 'GUEST', accountId: null, guestId }) });
  });

  router.post('/:id/claim', requireVerifiedUser, async (request, response) => {
    const account = request.authenticatedUser!;
    const token = request.cookies?.[GAME_GUEST_COOKIE];
    if (typeof token !== 'string') throw new HttpError(400, 'GUEST_IDENTITY_NOT_FOUND', 'No se encontró la identidad invitada de este navegador.');
    const guestId = await repository.ensureGuest(token);
    const game = await repository.claim(String(request.params.id), guestId, account.id);
    if (!game) throw new HttpError(404, 'GAME_NOT_FOUND', 'No existe esa partida invitada.');
    response.json({ game });
  });

  router.use((request, _response, next) => {
    if (!request.authenticatedUser) return next(new HttpError(401, 'UNAUTHENTICATED', 'Inicia sesión para gestionar partidas.'));
    next();
  }, requireVerifiedUser);
  router.use((request, _response, next) => {
    request.gamePrincipal = { type: 'ACCOUNT', accountId: request.authenticatedUser!.id, guestId: null };
    next();
  });

  router.get('/', async (request, response) => {
    response.json({ games: await repository.list(requirePrincipal(request)) });
  });

  router.post('/', async (request, response) => {
    const parsed = createGameSchema.safeParse(request.body);
    if (!parsed.success) throw new HttpError(400, 'INVALID_GAME', 'La configuración de la partida no es válida.');
    const game = await repository.create(randomUUID(), requirePrincipal(request), parsed.data);
    response.status(201).json({ game });
  });

  router.get('/:id', async (request, response) => {
    const game = await repository.find(request.params.id, requirePrincipal(request));
    if (!game) throw new HttpError(404, 'GAME_NOT_FOUND', 'No existe esa partida.');
    response.json({ game });
  });

  router.post('/:id/commands', async (request, response) => {
    const parsed = commandSchema.safeParse(request.body);
    if (!parsed.success) throw new HttpError(400, 'INVALID_GAME_COMMAND', 'La acción de la partida no es válida.');
    const game = await repository.command(request.params.id, requirePrincipal(request), expectedRevision(request), parsed.data);
    if (!game) throw new HttpError(404, 'GAME_NOT_FOUND', 'No existe esa partida.');
    response.json({ game });
  });

  router.post('/:id/link-list', async (request, response) => {
    const parsed = linkListSchema.safeParse(request.body);
    if (!parsed.success) throw new HttpError(400, 'INVALID_GAME_LINK', 'La asociación de la partida no es válida.');
    const game = await repository.linkList(request.params.id, requirePrincipal(request), expectedRevision(request), parsed.data);
    if (!game) throw new HttpError(404, 'GAME_NOT_FOUND', 'No existe esa partida.');
    response.json({ game });
  });

  router.delete('/:id', async (request, response) => {
    const deleted = await repository.delete(request.params.id, requirePrincipal(request));
    if (!deleted) throw new HttpError(404, 'GAME_NOT_FOUND', 'No existe esa partida.');
    response.status(204).end();
  });

  return router;
}
