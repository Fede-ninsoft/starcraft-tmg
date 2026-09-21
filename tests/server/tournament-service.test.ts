import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createTournament, applyTournamentCommand, publicTournament } from '../../server/src/modules/tournaments/tournament.service';
import type { UserRecord } from '../../server/src/modules/auth/auth.repository';
import type { SavedListRecord } from '../../server/src/modules/lists/list.repository';
import { manualExampleList, indexFor } from '../fixtures';
import { tournamentConfig } from '../tournament-fixture';
const now = '2030-10-10T10:00:00.000Z';
const user = (name: string): UserRecord => ({ id: randomUUID(), nickname: name, email: `${name}@example.test`, passwordHash: null, googleSub: null, emailVerifiedAt: now, deletedAt: null, sessionVersion: 1, defaultRace: 'TERRAN', locale: 'es', avatar: null, isActive: true, lastLoginAt: null });
const owner = user('TO'); const a = user('A'); const b = user('B');
const deps = { auth: { findById: async () => owner, findByEmail: async () => owner }, lists: { findForOwner: async () => ({ payload: manualExampleList() } as SavedListRecord) } };
describe('tournament lifecycle and permissions', () => {
  it.each(['COMMUNITY', 'COMPETITIVE'] as const)('accepts valid rosters from another catalog version in %s events', async (kind) => {
    const t = createTournament({ ...tournamentConfig, kind }, owner, now);
    const payload = manualExampleList(); payload.catalogContentVersion = 'older-catalog';
    const original = structuredClone(payload);
    const sources = { ...deps, lists: { findForOwner: async () => ({ payload } as SavedListRecord) } };
    await applyTournamentCommand(t, { type: 'PUBLISH' }, owner, sources, now);
    await applyTournamentCommand(t, { type: 'JOIN', race: 'TERRAN' }, a, sources, now);
    await applyTournamentCommand(t, { type: 'ROSTER', listId: randomUUID(), slot: 1 }, a, sources, now);
    expect(t.players[0]!.rosters).toHaveLength(1);
    expect(payload).toEqual(original);
    payload.entries[0]!.unitEntryId = 'unit-not-in-event-catalog';
    await expect(applyTournamentCommand(t, { type: 'ROSTER', listId: randomUUID(), slot: 1 }, a, sources, now)).rejects.toMatchObject({ code: 'ILLEGAL_ROSTER' });
    expect(t.players[0]!.rosters[0]!.list).toEqual(original);
  });
  it('completes a community tournament without any rosters but still requires check-in', async () => {
    const t = createTournament({ ...tournamentConfig, rounds: 1 }, owner, now);
    const send = (c: Parameters<typeof applyTournamentCommand>[1]) => applyTournamentCommand(t, c, owner, deps, now);
    for (const name of ['Guest A', 'Guest B']) await send({ type: 'ADD_GUEST', name, race: 'TERRAN' });
    await send({ type: 'PUBLISH' });
    await expect(send({ type: 'START' })).rejects.toMatchObject({ code: 'CHECK_IN_REQUIRED' });
    for (const p of t.players) await send({ type: 'CHECK_IN', playerId: p.id, checkedIn: true });
    await send({ type: 'START' }); await send({ type: 'GENERATE' });
    await send({ type: 'PUBLISH_ROUND', acceptWarning: false }); await send({ type: 'START_ROUND' });
    const matchId = t.rounds[0]!.matches[0]!.id;
    await expect(send({ type: 'RESULT', missionId: t.catalogs.ZERG.missionCards.find((m) => m.scale === t.config.scale)!.id, matchId, vp: [12, 2], end: 'NORMAL', winner: null, rosterIds: [randomUUID(), null], reason: '' })).rejects.toMatchObject({ code: 'ROSTER_SELECTION' });
    await send({ type: 'RESULT', missionId: t.catalogs.ZERG.missionCards.find((m) => m.scale === t.config.scale)!.id, matchId, vp: [12, 2], end: 'NORMAL', winner: null, rosterIds: [null, null], reason: '' });
    await send({ type: 'CLOSE_ROUND' }); await send({ type: 'COMPLETE' });
    expect(t.status).toBe('COMPLETED');
    expect(t.players.every((p) => p.rosters.length === 0)).toBe(true);
  });
  it('keeps approved rosters mandatory in competitive tournaments', async () => {
    const t = createTournament({ ...tournamentConfig, kind: 'COMPETITIVE' }, owner, now);
    const send = (c: Parameters<typeof applyTournamentCommand>[1]) => applyTournamentCommand(t, c, owner, deps, now);
    for (let i = 0; i < 12; i++) await send({ type: 'ADD_GUEST', name: `Guest ${i}`, race: 'TERRAN' });
    for (const p of t.players) await send({ type: 'CHECK_IN', playerId: p.id, checkedIn: true });
    await send({ type: 'PUBLISH' });
    await expect(send({ type: 'START' })).rejects.toMatchObject({ code: 'PLAYERS_NOT_READY' });
    t.status = 'IN_PROGRESS';
    await send({ type: 'GENERATE' }); await send({ type: 'PUBLISH_ROUND', acceptWarning: false }); await send({ type: 'START_ROUND' });
    await expect(send({ type: 'RESULT', missionId: t.catalogs.ZERG.missionCards.find((m) => m.scale === t.config.scale)!.id, matchId: t.rounds[0]!.matches[0]!.id, vp: [12, 2], end: 'NORMAL', winner: null, rosterIds: [null, null], reason: '' })).rejects.toMatchObject({ code: 'ROSTER_SELECTION' });
  });
  it('lets the owner run a tournament with guests who have no platform accounts', async () => {
    const t = createTournament({ ...tournamentConfig, capacity: 2, rounds: 1, registrationMode: 'INVITE_ONLY' }, owner, now);
    const sourceOwners: string[] = [];
    const sources = { ...deps, lists: { findForOwner: async (_id: string, ownerId: string) => { sourceOwners.push(ownerId); return { payload: manualExampleList() } as SavedListRecord; } } };
    const send = (command: Parameters<typeof applyTournamentCommand>[1], actor = owner) => applyTournamentCommand(t, command, actor, sources, now);
    await expect(send({ type: 'ADD_GUEST', name: 'Guest', race: 'TERRAN' }, a)).rejects.toMatchObject({ status: 403 });
    for (const name of ['Guest A', 'Guest B']) await send({ type: 'ADD_GUEST', name, race: 'TERRAN' });
    expect(t.players.every((p) => p.guest && p.id !== owner.id)).toBe(true);
    expect(new Set(t.players.map((p) => p.id)).size).toBe(2);
    await expect(send({ type: 'ADD_GUEST', name: 'Full', race: 'ZERG' })).rejects.toMatchObject({ code: 'CAPACITY' });
    for (const p of t.players) {
      await expect(send({ type: 'GUEST_ROSTER', playerId: p.id, listId: randomUUID(), slot: 1 }, a)).rejects.toMatchObject({ status: 403 });
      await send({ type: 'GUEST_ROSTER', playerId: p.id, listId: randomUUID(), slot: 1 });
      await send({ type: 'APPROVE', playerId: p.id, rosterId: p.rosters[0]!.id, approved: true });
      await send({ type: 'CHECK_IN', playerId: p.id, checkedIn: true });
    }
    expect(sourceOwners).toEqual([owner.id, owner.id]);
    await send({ type: 'PUBLISH' }); await send({ type: 'START' }); await send({ type: 'GENERATE' });
    await expect(send({ type: 'ADD_GUEST', name: 'Late', race: 'TERRAN' })).rejects.toMatchObject({ code: 'TOURNAMENT_STATE' });
    await send({ type: 'PUBLISH_ROUND', acceptWarning: false }); await send({ type: 'START_ROUND' });
    const m = t.rounds[0]!.matches[0]!;
    await send({ type: 'RESULT', missionId: t.catalogs.ZERG.missionCards.find((m) => m.scale === t.config.scale)!.id, matchId: m.id, vp: [12, 2], end: 'NORMAL', winner: null, reason: '', rosterIds: m.players.map((id) => t.players.find((p) => p.id === id)!.rosters[0]!.id) as [string, string] });
    await send({ type: 'CLOSE_ROUND' }); await send({ type: 'COMPLETE' });
    expect(t.status).toBe('COMPLETED');
  });
  it('validates guest names, deadlines and registered-player roster ownership', async () => {
    const { tournamentCommandSchema } = await import('../../server/src/modules/tournaments/tournament.schema');
    expect(tournamentCommandSchema.safeParse({ type: 'ADD_GUEST', name: '   ', race: 'TERRAN' }).success).toBe(false);
    const t = createTournament({ ...tournamentConfig }, owner, now);
    await expect(applyTournamentCommand(t, { type: 'ADD_GUEST', name: 'Late', race: 'TERRAN' }, owner, deps, t.config.startsAt)).rejects.toMatchObject({ code: 'REGISTRATION_CLOSED' });
    await applyTournamentCommand(t, { type: 'PUBLISH' }, owner, deps, now);
    await applyTournamentCommand(t, { type: 'JOIN', race: 'TERRAN' }, a, deps, now);
    await expect(applyTournamentCommand(t, { type: 'GUEST_ROSTER', playerId: a.id, listId: randomUUID(), slot: 1 }, owner, deps, now)).rejects.toMatchObject({ code: 'GUEST_REQUIRED' });
    await applyTournamentCommand(t, { type: 'ADD_GUEST', name: 'Guest', race: 'TERRAN' }, owner, deps, now);
    t.config.rosterDeadlineAt = '2030-10-01T00:00:00.000Z';
    await expect(applyTournamentCommand(t, { type: 'GUEST_ROSTER', playerId: t.players[1]!.id, listId: randomUUID(), slot: 1 }, owner, deps, now)).rejects.toMatchObject({ code: 'ROSTER_DEADLINE' });
  });
  it('publishes without optional event details and validates end dates', async () => {
    const { tournamentConfigSchema } = await import('../../server/src/modules/tournaments/tournament.schema');
    const config = tournamentConfigSchema.parse({ ...tournamentConfig, maps: undefined, conductContact: undefined, accessibility: undefined, endsAt: '2030-10-20T18:00:00.000Z' });
    expect(config.maps).toBe(''); expect(config.conductContact).toBe('');
    const t = createTournament(config, owner, now);
    await applyTournamentCommand(t, { type: 'PUBLISH' }, owner, deps, now);
    expect(t.status).toBe('PUBLISHED');
    expect(tournamentConfigSchema.safeParse({ ...config, endsAt: now }).success).toBe(false);
  });
  it('completes a tournament without opponent confirmation and preserves roster copies', async () => {
    const t = createTournament({ ...tournamentConfig, rounds: 1 }, owner, now);
    const send = (c: Parameters<typeof applyTournamentCommand>[1], who = owner) => applyTournamentCommand(t, c, who, deps, now);
    await send({ type: 'PUBLISH' });
    for (const who of [a, b]) {
      await send({ type: 'JOIN', race: 'TERRAN' }, who);
      await send({ type: 'CHECK_IN', playerId: who.id, checkedIn: true }, who);
      await send({ type: 'ROSTER', listId: randomUUID(), slot: 1 }, who);
      const roster = t.players.find((p) => p.id === who.id)!.rosters[0]!;
      await send({ type: 'APPROVE', playerId: who.id, rosterId: roster.id, approved: true });
    }
    expect(publicTournament(t, null, now).players[0]!.rosters).toEqual([]);
    expect(publicTournament(t, a.id, now).players[0]!.rosters).toHaveLength(1);
    await send({ type: 'START' }); await send({ type: 'GENERATE' });
    expect(publicTournament(t, a.id, now).rounds).toHaveLength(0);
    await send({ type: 'PUBLISH_ROUND', acceptWarning: false }); await send({ type: 'START_ROUND' });
    expect(publicTournament(t, a.id, now).players.every((p) => p.rosters.length === 1)).toBe(true);
    const match = t.rounds[0]!.matches[0]!;
    const rosterIds = match.players.map((id) => t.players.find((p) => p.id === id)!.rosters[0]!.id) as [string, string];
    await send({ type: 'RESULT', missionId: t.catalogs.ZERG.missionCards.find((m) => m.scale === t.config.scale)!.id, matchId: match.id, vp: [12, 10], end: 'NORMAL', winner: null, rosterIds, reason: '' }, a);
    await expect(send({ type: 'RESULT', missionId: t.catalogs.ZERG.missionCards.find((m) => m.scale === t.config.scale)!.id, matchId: match.id, vp: [0, 10], end: 'NORMAL', winner: null, rosterIds, reason: '' }, b)).rejects.toMatchObject({ code: 'RESULT_EXISTS' });
    await send({ type: 'CLOSE_ROUND' }); await send({ type: 'COMPLETE' });
    expect(t.status).toBe('COMPLETED');
    await expect(send({ type: 'ROSTER', listId: randomUUID(), slot: 1 }, a)).rejects.toMatchObject({ code: 'TOURNAMENT_STATE' });
  });
  it('private events are visible but joining requires a current invitation', async () => {
    const t = createTournament({ ...tournamentConfig, registrationMode: 'INVITE_ONLY' }, owner, now);
    await applyTournamentCommand(t, { type: 'PUBLISH' }, owner, deps, now);
    expect(publicTournament(t, null, now).config.name).toBe(t.config.name);
    expect(publicTournament(t, null, now)).not.toHaveProperty('invitationHash');
    await expect(applyTournamentCommand(t, { type: 'JOIN', race: 'TERRAN' }, a, deps, now)).rejects.toMatchObject({ code: 'INVITATION_REQUIRED' });
    const invitation = await applyTournamentCommand(t, { type: 'INVITATION', revoke: false }, owner, deps, now);
    await applyTournamentCommand(t, { type: 'INVITATION', revoke: true }, owner, deps, now);
    await expect(applyTournamentCommand(t, { type: 'JOIN', race: 'TERRAN', token: invitation.token }, a, deps, now)).rejects.toMatchObject({ code: 'INVITATION_REQUIRED' });
  });
  it('enforces start boundary and allows the owner to reopen roster submission', async () => {
    const t = createTournament({ ...tournamentConfig, rosterDeadlineAt: '2030-10-01T10:00:00.000Z' }, owner, now);
    await applyTournamentCommand(t, { type: 'PUBLISH' }, owner, deps, now);
    await expect(applyTournamentCommand(t, { type: 'JOIN', race: 'TERRAN' }, a, deps, t.config.startsAt)).rejects.toMatchObject({ code: 'REGISTRATION_CLOSED' });
    await applyTournamentCommand(t, { type: 'JOIN', race: 'TERRAN' }, a, deps, now);
    await expect(applyTournamentCommand(t, { type: 'ROSTER', slot: 1, listId: randomUUID() }, a, deps, now)).rejects.toMatchObject({ code: 'ROSTER_DEADLINE' });
    await expect(applyTournamentCommand(t, { type: 'DEADLINE', deadline: t.config.startsAt }, a, deps, now)).rejects.toMatchObject({ status: 403 });
    await applyTournamentCommand(t, { type: 'DEADLINE', deadline: t.config.startsAt }, owner, deps, now);
    await applyTournamentCommand(t, { type: 'ROSTER', slot: 1, listId: randomUUID() }, a, deps, now);
    expect(t.players[0]!.rosters).toHaveLength(1);
  });
  it('allows different faction cards within the same race, rejects a foreign race and a third slot', async () => {
    const t = createTournament(tournamentConfig, owner, now);
    await applyTournamentCommand(t, { type: 'PUBLISH' }, owner, deps, now);
    await applyTournamentCommand(t, { type: 'JOIN', race: 'TERRAN' }, a, deps, now);
    for (const [i, faction] of indexFor('TERRAN').catalog.factionCards.entries()) {
      const list = manualExampleList(); list.factionCardId = faction.id; list.entries = [list.entries[0]!]; list.tacticalCardIds = [];
      const source = { ...deps, lists: { findForOwner: async () => ({ payload: list } as SavedListRecord) } };
      await applyTournamentCommand(t, { type: 'ROSTER', listId: randomUUID(), slot: i + 1 }, a, source, now);
    }
    expect(new Set(t.players[0]!.rosters.map((r) => r.list.factionCardId)).size).toBe(2);
    const zerg = manualExampleList(); zerg.race = 'ZERG';
    await expect(applyTournamentCommand(t, { type: 'ROSTER', listId: randomUUID(), slot: 1 }, a, { ...deps, lists: { findForOwner: async () => ({ payload: zerg } as SavedListRecord) } }, now)).rejects.toMatchObject({ code: 'ROSTER_FORMAT' });
    const { tournamentCommandSchema } = await import('../../server/src/modules/tournaments/tournament.schema');
    expect(tournamentCommandSchema.safeParse({ type: 'ROSTER', listId: randomUUID(), slot: 3 }).success).toBe(false);
  });
  it('only lets the organiser apply sanctions, ignoring legacy judge assignments', async () => {
    const t = createTournament(tournamentConfig, owner, now); t.status = 'IN_PROGRESS';
    t.judges = [{ id: a.id, name: a.nickname!, role: 'HEAD' }];
    t.players = [{ id: b.id, name: b.nickname!, race: 'TERRAN', status: 'ACTIVE', checkedIn: true, spare: false, rosters: [] }];
    await expect(applyTournamentCommand(t, { type: 'PENALTY', playerId: b.id, penalty: 'DISQUALIFICATION', reason: 'Reviewed conduct incident' }, a, deps, now)).rejects.toMatchObject({ status: 403 });
    await applyTournamentCommand(t, { type: 'PENALTY', playerId: b.id, penalty: 'DISQUALIFICATION', reason: 'Reviewed conduct incident' }, owner, deps, now);
    expect(t.players[0]!.status).toBe('DISQUALIFIED');
    expect(t.penalties[0]!.pending).toBeUndefined();
  });
  it('allows a playing organiser to start and correct results without judges', async () => {
    const t = createTournament({ ...tournamentConfig, rounds: 1 }, owner, now);
    const send = (c: Parameters<typeof applyTournamentCommand>[1], who = owner) => applyTournamentCommand(t, c, who, deps, now);
    await send({ type: 'PUBLISH' });
    for (const who of [owner, a]) { await send({ type: 'JOIN', race: 'TERRAN' }, who); await send({ type: 'CHECK_IN', playerId: who.id, checkedIn: true }); }
    await send({ type: 'START' }); await send({ type: 'GENERATE' }); await send({ type: 'PUBLISH_ROUND', acceptWarning: false }); await send({ type: 'START_ROUND' });
    const matchId = t.rounds[0]!.matches[0]!.id;
    await send({ type: 'RESULT', missionId: t.catalogs.ZERG.missionCards.find((m) => m.scale === t.config.scale)!.id, matchId, vp: [10, 0], end: 'NORMAL', winner: null, rosterIds: [null, null], reason: '' });
    await expect(send({ type: 'RESOLVE', matchId, vp: [10, 1], end: 'NORMAL', winner: null, reason: 'Score correction' }, a)).rejects.toMatchObject({ status: 403 });
    await send({ type: 'RESOLVE', matchId, vp: [10, 1], end: 'NORMAL', winner: null, reason: 'Score correction' });
    expect(t.rounds[0]!.matches[0]!.result?.vp).toEqual([10, 1]);
    const { tournamentCommandSchema } = await import('../../server/src/modules/tournaments/tournament.schema');
    expect(tournamentCommandSchema.safeParse({ type: 'JUDGE', email: 'judge@example.test', role: 'HEAD', spare: false }).success).toBe(false);
  });
});
