import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import jwt from 'jsonwebtoken';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../server/src/app';
import { readEnvironment } from '../../server/src/config/env';
import { createPool, type DatabasePool } from '../../server/src/db/pool';
import { AuthRepository, type UserRecord } from '../../server/src/modules/auth/auth.repository';
import { ListRepository } from '../../server/src/modules/lists/list.repository';
import type { TournamentResponse } from '@/auth/tournamentService';
import type { TournamentCommand } from '../../server/src/modules/tournaments/tournament.schema';
import { manualExampleList } from '../fixtures';
import { tournamentConfig } from '../tournament-fixture';

/** Opt-in: uses the configured local DB, only creates/deletes its own UUIDs. */
describe.skipIf(process.env.TEST_TOURNAMENT_DATABASE !== '1')('tournament HTTP + MariaDB', () => {
  let pool: DatabasePool; let server: Server; let base: string;
  let env: ReturnType<typeof readEnvironment>; const users: UserRecord[] = []; const events: string[] = [];
  beforeAll(async () => {
    env = readEnvironment(); pool = createPool(env.DATABASE_URL);
    const auth = new AuthRepository(pool);
    for (let i = 0; i < 4; i++) {
      const email = `tournament-test-${randomUUID()}@example.test`;
      const u = await auth.createUser(email, email, 'not-a-login-hash'); users.push(u);
      if (i !== 3) await pool.execute('UPDATE users SET email_verified_at = NOW() WHERE id = ?', [u.id]);
    }
    server = await new Promise<Server>((resolve) => { const s = createApp(pool, env).listen(0, '127.0.0.1', () => resolve(s)); });
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/tournaments`;
  });
  afterAll(async () => {
    if (server) await new Promise<void>((resolve) => server.close(() => resolve()));
    if (!pool) return;
    for (const id of events) { await pool.execute('DELETE FROM tournament_audit WHERE tournament_id = ?', [id]); await pool.execute('DELETE FROM tournaments WHERE id = ?', [id]); }
    for (const u of users) { await pool.execute('DELETE FROM saved_lists WHERE owner_id = ?', [u.id]); await pool.execute('DELETE FROM profiles WHERE user_id = ?', [u.id]); await pool.execute('DELETE FROM users WHERE id = ?', [u.id]); }
    await pool.end();
  });
  const headers = (i: number) => ({ Origin: env.APP_ORIGIN, 'Content-Type': 'application/json', Cookie: `sctmg_session=${jwt.sign({ sub: users[i]!.id, sv: users[i]!.sessionVersion }, env.SESSION_SECRET)}` });
  const command = (t: TournamentResponse['tournament'], c: TournamentCommand, i = 0) => fetch(`${base}/${t.id}/commands`, { method: 'POST', headers: { ...headers(i), 'If-Match': String(t.revision) }, body: JSON.stringify(c) });
  it('rejects anonymous/unverified creation and cross-origin writes', async () => {
    expect((await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status).toBe(401);
    expect((await fetch(base, { method: 'POST', headers: headers(3), body: JSON.stringify(tournamentConfig) })).status).toBe(403);
    expect((await fetch(base, { method: 'POST', headers: { ...headers(0), Origin: 'https://untrusted.example' }, body: JSON.stringify(tournamentConfig) })).status).toBe(403);
  });
  it('puts active registrations before pagination and marks only the signed-in player', async () => {
    const { TournamentRepository } = await import('../../server/src/modules/tournaments/tournament.repository');
    const { createTournament } = await import('../../server/src/modules/tournaments/tournament.service');
    const repository = new TournamentRepository(pool);
    for (let i = 0; i < 26; i++) {
      const t = createTournament({ ...tournamentConfig, startsAt: '2090-01-01T10:00:00.000Z' }, users[0]!, '2030-01-01T00:00:00.000Z');
      t.status = 'PUBLISHED'; events.push(t.id); await repository.create(t);
    }
    const enrolled = createTournament({ ...tournamentConfig, startsAt: '2000-01-01T10:00:00.000Z' }, users[0]!, '1999-01-01T00:00:00.000Z');
    enrolled.status = 'PUBLISHED';
    enrolled.players.push({ id: users[1]!.id, name: 'Registered player', race: 'ZERG', status: 'ACTIVE', checkedIn: false, spare: false, rosters: [] });
    enrolled.players.push({ id: users[2]!.id, name: 'Withdrawn player', race: 'TERRAN', status: 'WITHDRAWN', checkedIn: false, spare: false, rosters: [] });
    events.push(enrolled.id); await repository.create(enrolled);
    const first = await repository.list(users[1]!.id, 0);
    expect(first).toHaveLength(25);
    expect(first[0]!.id).toBe(enrolled.id);
    expect((await repository.list(users[1]!.id, 25)).some((t) => t.id === enrolled.id)).toBe(false);
    for (const viewer of [null, users[0]!.id, users[2]!.id]) {
      expect((await repository.list(viewer, 0)).some((t) => t.id === enrolled.id)).toBe(false);
    }
    const response = await fetch(base, { headers: headers(1) });
    expect(response.status).toBe(200);
    const page = await response.json();
    expect(page.tournaments[0]).toMatchObject({ id: enrolled.id, isRegistered: true });
    expect(page.tournaments.slice(1).every((t: { isRegistered: boolean }) => !t.isRegistered)).toBe(true);
    expect(page.tournaments[0]).not.toHaveProperty('players');
    const anonymous = await (await fetch(base)).json();
    expect(anonymous.tournaments.every((t: { isRegistered: boolean }) => !t.isRegistered)).toBe(true);
  });
  it('persists manual guests without creating platform accounts', async () => {
    const response = await fetch(base, { method: 'POST', headers: headers(0), body: JSON.stringify(tournamentConfig) });
    expect(response.status).toBe(201);
    const t = ((await response.json()) as TournamentResponse).tournament; events.push(t.id);
    expect((await command(t, { type: 'ADD_GUEST', name: 'Invitado manual', race: 'ZERG' }, 1)).status).toBe(403);
    const added = await command(t, { type: 'ADD_GUEST', name: 'Invitado manual', race: 'ZERG' });
    expect(added.status).toBe(200);
    const reloaded = ((await (await fetch(`${base}/${t.id}`, { headers: headers(0) })).json()) as TournamentResponse).tournament;
    expect(reloaded.players[0]).toMatchObject({ name: 'Invitado manual', race: 'ZERG', guest: true });
    expect(await new AuthRepository(pool).findById(reloaded.players[0]!.id)).toBeNull();
  });
  it('filters before pagination using roster closure and the two-day end boundary', async () => {
    const { TournamentRepository } = await import('../../server/src/modules/tournaments/tournament.repository');
    const { createTournament } = await import('../../server/src/modules/tournaments/tournament.service');
    const repository = new TournamentRepository(pool);
    const t = createTournament({ ...tournamentConfig, endsAt: '2030-10-20T18:00:00.000Z' }, users[0]!, '2030-10-10T10:00:00.000Z');
    t.status = 'PUBLISHED'; events.push(t.id); await repository.create(t);
    const present = async (period: 'current' | 'future' | 'past', at: string) => (await repository.list(users[0]!.id, 0, period, new Date(at))).some((e) => e.id === t.id);
    expect(await present('future', '2030-10-19T09:59:59.999Z')).toBe(true);
    expect(await present('current', t.config.rosterDeadlineAt)).toBe(true);
    expect(await present('current', '2030-10-22T18:00:00.000Z')).toBe(true);
    expect(await present('past', '2030-10-22T18:00:00.001Z')).toBe(true);
    expect(await present('current', '2030-10-22T18:00:00.001Z')).toBe(false);
    await pool.execute("UPDATE tournaments SET payload = JSON_SET(payload, '$.config.rosterDeadlineAt', '2030-10-20T17:00:00.000Z') WHERE id = ?", [t.id]);
    expect(await present('future', '2030-10-20T16:00:00.000Z')).toBe(true);
    await pool.execute("UPDATE tournaments SET payload = JSON_REMOVE(payload, '$.config.endsAt') WHERE id = ?", [t.id]);
    expect(await present('current', '2030-10-22T17:30:00.000Z')).toBe(true);
    expect(await present('past', '2030-10-22T17:30:00.001Z')).toBe(true);
    expect((await fetch(`${base}?period=invalid`)).status).toBe(400);
  });
  it('serializes concurrent registration and result writes, survives repository reload and completes a tournament', async () => {
    const response = await fetch(base, { method: 'POST', headers: headers(0), body: JSON.stringify({ ...tournamentConfig, capacity: 2, rounds: 1 }) });
    expect(response.status).toBe(201);
    let t = ((await response.json()) as TournamentResponse).tournament; events.push(t.id);
    const send = async (c: TournamentCommand, i = 0) => { const r = await command(t, c, i); const data = await r.json(); expect(r.status, JSON.stringify(data)).toBe(200); t = (data as TournamentResponse).tournament; };
    expect((await fetch(`${base}/${t.id}`)).status).toBe(404);
    expect((await command(t, { type: 'PUBLISH' }, 1)).status).toBe(403);
    await send({ type: 'PUBLISH' });
    const joins = await Promise.all([command(t, { type: 'JOIN', race: 'TERRAN' }, 1), command(t, { type: 'JOIN', race: 'TERRAN' }, 2)]);
    expect(joins.map((r) => r.status).sort()).toEqual([200, 409]);
    t = ((await (await fetch(`${base}/${t.id}`, { headers: headers(0) })).json()) as TournamentResponse).tournament;
    const missing = t.players.some((p) => p.id === users[1]!.id) ? 2 : 1;
    await send({ type: 'JOIN', race: 'TERRAN' }, missing);
    expect((await command(t, { type: 'JOIN', race: 'TERRAN' }, 0)).status).toBe(409);
    const lists = new ListRepository(pool);
    for (const i of [1, 2]) {
      const payload = manualExampleList(); payload.id = randomUUID(); payload.entries.forEach((e) => { e.instanceId = randomUUID(); });
      await lists.create(users[i]!.id, payload);
      await send({ type: 'CHECK_IN', playerId: users[i]!.id, checkedIn: true }, i);
      await send({ type: 'ROSTER', listId: payload.id, slot: 1 }, i);
      const roster = t.players.find((p) => p.id === users[i]!.id)!.rosters[0]!;
      await send({ type: 'APPROVE', playerId: users[i]!.id, rosterId: roster.id, approved: true });
      await lists.delete(payload.id, users[i]!.id);
      expect(t.players.find((p) => p.id === users[i]!.id)!.rosters[0]!.list.name).toBe(payload.name);
    }
    await send({ type: 'START' }); await send({ type: 'GENERATE' }); await send({ type: 'PUBLISH_ROUND', acceptWarning: false }); await send({ type: 'START_ROUND' });
    const m = t.rounds[0]!.matches[0]!;
    const rosterIds = m.players.map((id) => t.players.find((p) => p.id === id)!.rosters[0]!.id) as [string, string];
    const result: TournamentCommand = { type: 'RESULT', missionId: t.availableMissions![0]!.id, matchId: m.id, vp: [10, 0], end: 'NORMAL', winner: null, rosterIds, reason: '' };
    const results = await Promise.all([command(t, result, 1), command(t, result, 2)]);
    expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
    t = ((await (await fetch(`${base}/${t.id}`, { headers: headers(0) })).json()) as TournamentResponse).tournament;
    await send({ type: 'CLOSE_ROUND' }); await send({ type: 'COMPLETE' });
    const final = (await (await fetch(`${base}/${t.id}`)).json()) as TournamentResponse;
    expect(final.tournament.status).toBe('COMPLETED'); expect(final.standings[0]!.mp).toBe(3);
    expect((await fetch(`${base}/${t.id}/audit`, { headers: headers(1) })).status).toBe(403);
    const audit = await (await fetch(`${base}/${t.id}/audit`, { headers: headers(0) })).json();
    expect(audit.audit.length).toBeGreaterThan(10);
  });
});
