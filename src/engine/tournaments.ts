import type { ArmyList, Catalog, Race } from './types';

export type TournamentStatus = 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TournamentEnd = 'NORMAL' | 'TIME' | 'CONCESSION' | 'NO_SHOW' | 'GAME_LOSS' | 'BYE';
export interface TournamentConfig {
  name: string; description: string; location: string; timezone: string;
  startsAt: string; endsAt?: string; rosterDeadlineAt: string; rostersPublicAt: string; rulesCutoffAt: string;
  capacity: number; rounds: number; roundMinutes: number;
  kind: 'COMMUNITY' | 'COMPETITIVE'; scale: 'standard' | 'skirmish';
  registrationMode: 'OPEN' | 'INVITE_ONLY'; listFormat: 'SINGLE' | 'DUAL';
  rules: string; maps: string; conductContact: string; accessibility?: string;
}
export interface TournamentRoster { id: string; slot: number; list: ArmyList; text: string; submittedAt: string; approved: boolean }
export interface TournamentPlayer {
  guest?: boolean;
  id: string; name: string; race: Race; status: 'ACTIVE' | 'WITHDRAWN' | 'DISQUALIFIED';
  checkedIn: boolean; spare: boolean; rosters: TournamentRoster[]; rosterHistory?: TournamentRoster[];
}
export interface TournamentResult { vp: [number, number]; end: TournamentEnd; winner: 0 | 1 | null; actor: string; at: string; reason: string }
export interface TournamentMatch { id: string; table: number; players: [string, string | null]; result: TournamentResult | null; disputed: boolean; rosterIds: [string | null, string | null] }
export interface TournamentRound { number: number; status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'CLOSED'; seed: number; startedAt: string | null; matches: TournamentMatch[]; warning: string | null }
export interface Tournament {
  id: string; ownerId: string; ownerName: string; revision: number; createdAt: string;
  status: TournamentStatus; config: TournamentConfig; players: TournamentPlayer[];
  rounds: TournamentRound[]; judges: { id: string; name: string; role: 'HEAD' | 'FLOOR' }[];
  penalties: { playerId: string; type: 'CAUTION' | 'WARNING' | 'GAME_LOSS' | 'DISQUALIFICATION'; reason: string; actor: string; at: string; pending?: boolean; approvedBy?: string }[];
  rulesVersion: string;
}
export interface StoredTournament extends Tournament { invitationHash: string | null; invitationExpiresAt: string | null; catalogs: Record<Race, Catalog> }
export interface Standing { id: string; name: string; race: Race; mp: number; tp: number; wins: number; draws: number; losses: number; sos: number; otp: number; opponentMP: number; opponentTP: number; opponentCount: number; position: number }

/** Organised Play v1.0, pp. 7–8. PV are not tournament points. */
export function tournamentScore(result: Pick<TournamentResult, 'vp' | 'end' | 'winner'>, scale: 'standard' | 'skirmish'): [[number, number], [number, number]] {
  if (result.end !== 'NORMAL' && result.end !== 'TIME') {
    const win: [number, number] = [3, result.end === 'BYE' || result.end === 'NO_SHOW' ? 4 : 5];
    if (result.winner === null) throw new Error('Winner required for exceptional results');
    return result.winner === 0 ? [win, [0, 0]] : [[0, 0], win];
  }
  const difference = Math.abs(result.vp[0] - result.vp[1]);
  if (difference <= 2) return [[1, 2], [1, 2]];
  const tp = difference >= (scale === 'standard' ? 10 : 8) ? 5 : difference >= (scale === 'standard' ? 7 : 6) ? 4 : 3;
  return result.vp[0] > result.vp[1] ? [[3, tp], [0, 5 - tp]] : [[0, 5 - tp], [3, tp]];
}

function compareStandings(a: Standing, b: Standing): number {
  return b.mp - a.mp || b.tp - a.tp ||
    b.opponentMP * (a.opponentCount || 1) - a.opponentMP * (b.opponentCount || 1) ||
    b.opponentTP * (a.opponentCount || 1) - a.opponentTP * (b.opponentCount || 1);
}
export function tournamentStandings(t: Pick<Tournament, 'players' | 'rounds' | 'config'>): Standing[] {
  const rows = new Map(t.players.map((p) => [p.id, { id: p.id, name: p.name, race: p.race, mp: 0, tp: 0, wins: 0, draws: 0, losses: 0, sos: 0, otp: 0, opponentMP: 0, opponentTP: 0, opponentCount: 0, position: 0 }]));
  const matches = t.rounds.filter((r) => r.status !== 'DRAFT').flatMap((r) => r.matches).filter((m) => m.result && !m.disputed);
  for (const m of matches) {
    const score = tournamentScore(m.result!, t.config.scale);
    m.players.forEach((id, i) => {
      const row = id ? rows.get(id) : null;
      if (!row) return;
      const [mp, tp] = score[i]!;
      row.mp += mp; row.tp += tp;
      if (mp === 3) row.wins++; else if (mp === 1) row.draws++; else row.losses++;
    });
  }
  const spare = new Set(t.players.filter((p) => p.spare).map((p) => p.id));
  for (const m of matches) {
    if (['BYE', 'NO_SHOW'].includes(m.result!.end) || m.players.some((id) => id && spare.has(id))) continue;
    m.players.forEach((id, i) => {
      const row = id ? rows.get(id) : null;
      const opponent = rows.get(m.players[1 - i] ?? '');
      if (row && opponent) { row.opponentMP += opponent.mp; row.opponentTP += opponent.tp; row.opponentCount++; }
    });
  }
  const disqualified = new Set(t.players.filter((p) => p.status === 'DISQUALIFIED').map((p) => p.id));
  const ranked = [...rows.values()].filter((r) => !spare.has(r.id) && !disqualified.has(r.id)).sort(compareStandings);
  ranked.forEach((r, i) => {
    r.sos = r.opponentMP / (r.opponentCount || 1); r.otp = r.opponentTP / (r.opponentCount || 1);
    r.position = i && compareStandings(r, ranked[i - 1]!) === 0 ? ranked[i - 1]!.position : i + 1;
  });
  return ranked;
}

/** Seeded search: exhaust non-repeat candidates before permitting rematches.
 * Bounded search reports its limit explicitly, never silently claims optimality. */
export function swissPairings(t: Tournament, seed: number): { pairs: [string, string | null][]; warning: string | null } {
  let state = seed >>> 0;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  const standings = new Map(tournamentStandings(t).map((s) => [s.id, s]));
  const history = t.rounds.filter((r) => r.status !== 'DRAFT').flatMap((r) => r.matches);
  const met = (a: string, b: string) => history.some((m) => m.players.includes(a) && m.players.includes(b));
  const byeCount = (id: string) => history.filter((m) => m.players[0] === id && !m.players[1]).length;
  const eligible = t.players.filter((p) => p.status === 'ACTIVE' && p.checkedIn);
  const regular = eligible.filter((p) => !p.spare);
  const spare = eligible.find((p) => p.spare);
  const entrants = regular.length % 2 && spare ? [...regular, spare] : regular;
  const ranked = entrants.map((p) => ({ id: p.id, mp: standings.get(p.id)?.mp ?? 0, tp: standings.get(p.id)?.tp ?? 0, tie: random() })).sort((a, b) => b.mp - a.mp || b.tp - a.tp || a.tie - b.tie);
  const pairs: [string, string | null][] = [];
  if (ranked.length % 2) {
    const bye = [...ranked].sort((a, b) => byeCount(a.id) - byeCount(b.id) || a.mp - b.mp || a.tp - b.tp || a.tie - b.tie)[0]!;
    pairs.push([bye.id, null]); ranked.splice(ranked.findIndex((p) => p.id === bye.id), 1);
  }
  let nodes = 0;
  function search(ids: string[], allowRepeats: boolean): [string, string][] | null {
    if (!ids.length) return [];
    if (++nodes > 100000) return null;
    const a = ids[0]!;
    const candidates = ids.slice(1).filter((b) => allowRepeats || !met(a, b)).sort((b, c) =>
      Number(met(a, b)) - Number(met(a, c)) || Math.abs((standings.get(a)?.mp ?? 0) - (standings.get(b)?.mp ?? 0)) - Math.abs((standings.get(a)?.mp ?? 0) - (standings.get(c)?.mp ?? 0)));
    for (const b of candidates) {
      const rest = search(ids.filter((id) => id !== a && id !== b), allowRepeats);
      if (rest) return [[a, b], ...rest];
    }
    return null;
  }
  let found = search(ranked.map((p) => p.id), false);
  let warning: string | null = null;
  if (!found) { warning = nodes > 100000 ? 'SEARCH_LIMIT' : 'REMATCH_REQUIRED'; nodes = 0; found = search(ranked.map((p) => p.id), true); }
  if (!found) throw new Error('PAIRING_FAILED');
  return { pairs: [...pairs, ...found], warning };
}
