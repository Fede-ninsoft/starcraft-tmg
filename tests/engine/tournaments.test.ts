import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { swissPairings, tournamentScore, tournamentStandings, type Tournament } from '@/engine/tournaments';

import { tournamentConfig } from '../tournament-fixture';
function event(count: number): Tournament { return { id: 'event', ownerId: 'owner', ownerName: 'Owner', createdAt: '', revision: 1, status: 'IN_PROGRESS', config: tournamentConfig, judges: [], penalties: [], rulesVersion: '1', rounds: [], players: Array.from({ length: count }, (_, i) => ({ id: String(i), name: String(i), race: 'TERRAN', status: 'ACTIVE', checkedIn: true, spare: false, rosters: [] })) }; }
describe('tournament scoring (Organised Play p.7)', () => {
  it.each([
    [0, 1, 2, 1, 2], [2, 1, 2, 1, 2], [3, 3, 3, 0, 2], [6, 3, 3, 0, 2], [7, 3, 4, 0, 1], [9, 3, 4, 0, 1], [10, 3, 5, 0, 0],
  ])('Standard difference %s', (d, mp, tp, omp, otp) => expect(tournamentScore({ vp: [d, 0], end: 'NORMAL', winner: null }, 'standard')).toEqual([[mp, tp], [omp, otp]]));
  it.each([[5, 3], [6, 4], [7, 4], [8, 5]])('Skirmish difference %s', (d, tp) => expect(tournamentScore({ vp: [0, d], end: 'NORMAL', winner: null }, 'skirmish')).toEqual([[0, 5 - tp], [3, tp]]));
  it.each([['CONCESSION', 5], ['GAME_LOSS', 5], ['NO_SHOW', 4], ['BYE', 4]] as const)('%s does not fabricate VP', (end, tp) => expect(tournamentScore({ vp: [0, 0], end, winner: 0 }, 'standard')).toEqual([[3, tp], [0, 0]]));
  it('is symmetric and treats narrow VP leads as draws', () => fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), fc.integer({ min: 0, max: 999 }), (a, b) => {
    const first = tournamentScore({ vp: [a, b], end: 'NORMAL', winner: null }, 'standard');
    expect(tournamentScore({ vp: [b, a], end: 'TIME', winner: null }, 'standard')).toEqual([first[1], first[0]]);
  })));
});
describe('standings and pairing invariants', () => {
  it('only uses the spare head judge when regular attendance is odd', () => {
    const t = event(5); t.players[4]!.spare = true;
    expect(swissPairings(t, 5).pairs.flat()).not.toContain('4');
    t.players[3]!.status = 'WITHDRAWN';
    const paired = swissPairings(t, 5).pairs.flat();
    expect(paired).toContain('4'); expect(paired).not.toContain(null); expect(paired).not.toContain('3');
  });
  it('shares tied places and does not invent opponent zeroes for byes', () => {
    const t = event(3);
    t.rounds.push({ number: 1, seed: 1, status: 'CLOSED', startedAt: null, warning: null, matches: [
      { id: 'a', table: 1, players: ['0', '1'], rosterIds: [null, null], disputed: false, result: { vp: [0, 0], end: 'CONCESSION', winner: 0, actor: '', at: '', reason: '' } },
      { id: 'b', table: 2, players: ['2', null], rosterIds: [null, null], disputed: false, result: { vp: [0, 0], end: 'BYE', winner: 0, actor: '', at: '', reason: '' } },
    ] });
    const rows = tournamentStandings(t);
    expect(rows.find((r) => r.id === '1')).toMatchObject({ sos: 3, otp: 5, opponentCount: 1 });
    expect(rows.find((r) => r.id === '2')).toMatchObject({ sos: 0, otp: 0, opponentCount: 0 });
    expect(tournamentStandings(event(3)).map((r) => r.position)).toEqual([1, 1, 1]);
    t.players[0]!.spare = true;
    expect(tournamentStandings(t).find((r) => r.id === '1')?.opponentCount).toBe(0);
  });
  it.each([2, 5, 12, 32, 33, 128])('pairs %s players exactly once with a reproducible seed', (count) => {
    const t = event(count); const output = swissPairings(t, 9);
    expect(swissPairings(t, 9)).toEqual(output);
    expect(new Set(output.pairs.flat().filter(Boolean)).size).toBe(count);
    expect(output.pairs.filter((p) => !p[1]).length).toBe(count % 2);
  });
  it('avoids rematches and repeated byes across three rounds', () => {
    const t = event(9); const seen = new Set<string>(); const byes = new Set<string>();
    for (let n = 1; n <= 3; n++) {
      const { pairs, warning } = swissPairings(t, n); expect(warning).toBeNull();
      t.rounds.push({ number: n, status: 'CLOSED', seed: n, warning: null, startedAt: null, matches: pairs.map((p, i) => {
        if (p[1]) { const key = [...p].sort().join(':'); expect(seen.has(key)).toBe(false); seen.add(key); }
        else { expect(byes.has(p[0])).toBe(false); byes.add(p[0]); }
        return { id: `${n}-${i}`, players: p, table: i, rosterIds: [null, null], disputed: false, result: { vp: [10, 0], end: p[1] ? 'NORMAL' : 'BYE', winner: 0, actor: '', at: '', reason: '' } };
      }) });
    }
  });
});
