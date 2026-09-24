import { createHash, randomBytes, randomInt, randomUUID } from 'node:crypto';
import { loadCatalog } from '../../../../src/catalog/loader.js';
import { buildCatalogIndex } from '../../../../src/engine/catalogIndex.js';
import { validateList } from '../../../../src/engine/validate.js';
import { entryMineralCost, entrySlotUsage } from '../../../../src/engine/costing.js';
import { swissPairings, tournamentPastCloseDeadline, tournamentScore, type StoredTournament, type Tournament, type TournamentConfig, type TournamentPlayer } from '../../../../src/engine/tournaments.js';
import { HttpError } from '../../lib/errors.js';
import type { AuthRepository, UserRecord } from '../auth/auth.repository.js';
import type { ListRepository } from '../lists/list.repository.js';
import type { TournamentCommand } from './tournament.schema.js';

function check(ok: unknown, code: string, message: string): asserts ok { if (!ok) throw new HttpError(409, code, message); }
export function canManageTournament(t: Tournament, id: string): boolean { return t.ownerId === id; }
function requireOwner(t: Tournament, id: string) { if (t.ownerId !== id) throw new HttpError(403, 'TOURNAMENT_FORBIDDEN', 'Solo el organizador puede realizar esta acción.'); }
const hash = (v: string) => createHash('sha256').update(v).digest('hex');

export function createTournament(config: TournamentConfig, user: UserRecord, now: string): StoredTournament {
  return { id: randomUUID(), ownerId: user.id, ownerName: user.nickname || 'Organizador', revision: 1, createdAt: now, status: 'DRAFT', config, players: [], rounds: [], judges: [], penalties: [], rulesVersion: 'organised-play-1.0', invitationHash: null, invitationExpiresAt: null,
    catalogs: { ZERG: loadCatalog('ZERG').catalog, TERRAN: loadCatalog('TERRAN').catalog, PROTOSS: loadCatalog('PROTOSS').catalog } };
}
export function publicTournament(t: StoredTournament, viewer: string | null, now: string): Tournament {
  if (t.status === 'DRAFT' && t.ownerId !== viewer) throw new HttpError(404, 'TOURNAMENT_NOT_FOUND', 'No existe ese torneo.');
  const { invitationHash: _hash, invitationExpiresAt: _expiry, catalogs: _catalogs, ...view } = structuredClone(t);
  const staff = !!viewer && canManageTournament(t, viewer);
  view.availableMissions = t.catalogs.ZERG.missionCards.filter((m) => m.scale === t.config.scale).map(({ id, name }) => ({ id, name }));
  view.penalties = staff ? view.penalties : [];
  for (const p of view.players) {
    const opponent = !!viewer && t.rounds.some((r) => ['PUBLISHED', 'ACTIVE'].includes(r.status) && r.matches.some((m) => m.players.includes(viewer) && m.players.includes(p.id)));
    if (!staff && p.id !== viewer && !opponent && now < t.config.rostersPublicAt) { p.rosters = []; p.rosterHistory = []; }
  }
  if (!staff) view.rounds = view.rounds.filter((r) => r.status !== 'DRAFT');
  // Result audit comments may contain private arbitration context.
  if (!staff) for (const r of view.rounds) for (const m of r.matches) if (m.result) m.result.reason = '';
  return view;
}

export async function applyTournamentCommand(t: StoredTournament, command: TournamentCommand, user: UserRecord, deps: { lists: Pick<ListRepository, 'findForOwner'>; auth: Pick<AuthRepository, 'findById' | 'findByEmail'> }, now: string): Promise<{ token?: string }> {
  const actor = user.id;
  const self = t.players.find((p) => p.id === actor);
  const round = t.rounds.at(-1);
  const active = () => check(t.status === 'IN_PROGRESS', 'TOURNAMENT_STATE', 'El torneo no está en curso.');
  const player = (id: string): TournamentPlayer => { const p = t.players.find((v) => v.id === id); check(p, 'PLAYER_NOT_FOUND', 'No existe ese participante.'); return p; };
  const beforeStart = () => check(t.status === 'DRAFT' || t.status === 'PUBLISHED', 'TOURNAMENT_STATE', 'El torneo ya ha comenzado.');
  if (command.type === 'CONFIGURE') {
    requireOwner(t, actor); beforeStart();
    check(t.players.filter((p) => p.status === 'ACTIVE').length <= command.config.capacity, 'CAPACITY', 'El aforo no puede ser menor que las inscripciones.');
    if (t.players.some((p) => p.rosters.length)) check(command.config.scale === t.config.scale && command.config.listFormat === t.config.listFormat && command.config.rulesCutoffAt === t.config.rulesCutoffAt, 'ROSTERS_LOCK_CONFIG', 'No se puede cambiar escala, formato o corte de reglas con listas entregadas.');
    check(command.config.startsAt > now, 'START_DATE', 'La fecha de inicio debe ser futura.');
    check(command.config.kind !== 'COMPETITIVE' || !t.players.some((p) => p.status === 'ACTIVE' && (p.id === t.ownerId)), 'COMPETITIVE_STAFF', 'El personal no puede competir.');
    t.config = command.config;
    if (t.invitationHash) t.invitationExpiresAt = command.config.startsAt;
  } else if (command.type === 'DEADLINE') {
    requireOwner(t, actor); check(!['COMPLETED', 'CANCELLED'].includes(t.status), 'TOURNAMENT_STATE', 'El torneo está cerrado.'); t.config.rosterDeadlineAt = command.deadline;
  } else if (command.type === 'ROUND_COUNT') {
    requireOwner(t, actor); active();
    check(!t.rounds.some((r) => r.number >= 2 && ['ACTIVE', 'CLOSED'].includes(r.status)), 'ROUND_COUNT_LOCKED', 'El número de rondas solo se reduce antes del inicio de la segunda.');
    check(!t.rounds.some((r) => r.status === 'ACTIVE' || r.status === 'CLOSED') || command.rounds <= t.config.rounds, 'ROUND_COUNT_LOCKED', 'Las ampliaciones deben anunciarse antes de jugar la primera ronda.');
    check(command.rounds >= t.rounds.filter((r) => r.status !== 'DRAFT').length, 'ROUND_COUNT_LOCKED', 'No se puede eliminar una ronda publicada.');
    if (round?.status === 'DRAFT' && round.number > command.rounds) t.rounds.pop();
    t.config.rounds = command.rounds;
    t.config.rules += `\n${now}: Rounds / Rondas: ${command.rounds}. ${command.reason}`;
  } else if (command.type === 'PUBLISH') {
    requireOwner(t, actor); check(t.status === 'DRAFT' && t.config.startsAt > now, 'TOURNAMENT_STATE', 'Revisa estado y fecha de inicio.');
    t.status = 'PUBLISHED';
  } else if (command.type === 'INVITATION') {
    requireOwner(t, actor); beforeStart(); const token = command.revoke ? null : randomBytes(32).toString('base64url');
    t.invitationHash = token ? hash(token) : null; t.invitationExpiresAt = token ? t.config.startsAt : null;
    return token ? { token } : {};
  } else if (command.type === 'ADD_GUEST') {
    requireOwner(t, actor); beforeStart();
    check(now < t.config.startsAt, 'REGISTRATION_CLOSED', 'La inscripción está cerrada.');
    check(t.players.filter((p) => p.status === 'ACTIVE').length < t.config.capacity, 'CAPACITY', 'El torneo está completo.');
    t.players.push({ id: randomUUID(), name: command.name.trim(), race: command.race, guest: true, status: 'ACTIVE', checkedIn: false, spare: false, rosters: [] });
  } else if (command.type === 'JOIN') {
    check(t.status === 'PUBLISHED' && now < t.config.startsAt, 'REGISTRATION_CLOSED', 'La inscripción está cerrada.');
    check(!self, 'ALREADY_REGISTERED', 'Ya tienes una inscripción en este torneo.');
    check(t.players.filter((p) => p.status === 'ACTIVE').length < t.config.capacity, 'CAPACITY', 'El torneo está completo.');
    check(t.config.registrationMode === 'OPEN' || (command.token && t.invitationHash === hash(command.token) && t.invitationExpiresAt && now < t.invitationExpiresAt), 'INVITATION_REQUIRED', 'Necesitas un enlace privado vigente.');
    check(t.config.kind !== 'COMPETITIVE' || (actor !== t.ownerId), 'COMPETITIVE_STAFF', 'El personal no puede competir.');
    t.players.push({ id: actor, name: user.nickname || 'Jugador', race: command.race, status: 'ACTIVE', checkedIn: false, spare: false, rosters: [] });
  } else if (command.type === 'WITHDRAW') {
    check(!['COMPLETED', 'CANCELLED'].includes(t.status), 'TOURNAMENT_STATE', 'El torneo está cerrado.');
    if (command.playerId !== actor) requireOwner(t, actor);
    const p = player(command.playerId);
    check(!round || round.status === 'CLOSED' || !round.matches.some((m) => m.players.includes(p.id) && (!m.result || m.disputed)), 'PENDING_MATCH', 'Resuelve la partida actual antes de retirar al jugador.');
    if (t.status === 'PUBLISHED' || t.status === 'DRAFT') t.players = t.players.filter((v) => v.id !== p.id); else p.status = 'WITHDRAWN';
  } else if (command.type === 'CHECK_IN') {
    beforeStart(); if (command.playerId !== actor) requireOwner(t, actor); player(command.playerId).checkedIn = command.checkedIn;
  } else if (command.type === 'ROSTER' || command.type === 'CORRECT_ROSTER' || command.type === 'GUEST_ROSTER') {
    if (command.type === 'GUEST_ROSTER') requireOwner(t, actor);
    const entrant = command.type === 'ROSTER' ? self : player(command.playerId);
    if (command.type === 'GUEST_ROSTER') check(entrant?.guest, 'GUEST_REQUIRED', 'Esta acción solo admite participantes invitados.');
    check(entrant?.status === 'ACTIVE', 'NOT_REGISTERED', 'Inscríbete antes de entregar listas.');
    if (command.type === 'CORRECT_ROSTER') {
      active(); requireOwner(t, actor);
      check(entrant.rosters.some((r) => r.slot === command.slot), 'ROSTER_NOT_FOUND', 'Solo se pueden corregir listas entregadas.');
      check(!t.rounds.some((r) => r.status === 'ACTIVE' && r.matches.some((m) => m.players.includes(entrant.id) && !m.result)), 'PENDING_MATCH', 'Resuelve la partida activa antes de sustituir la lista.');
    } else { beforeStart(); check(now <= t.config.rosterDeadlineAt, 'ROSTER_DEADLINE', 'El plazo de listas ha vencido. El organizador puede ampliarlo.'); }
    check(command.slot === 1 || t.config.listFormat === 'DUAL', 'SINGLE_LIST', 'Este torneo admite una sola lista.');
    const saved = await deps.lists.findForOwner(command.listId, entrant.guest ? t.ownerId : entrant.id);
    check(saved, 'LIST_NOT_FOUND', 'Selecciona una lista de tu cuenta.');
    const list = saved.payload;
    check(list.race === entrant.race && list.scaleId === t.config.scale && list.mineralLimit === (t.config.scale === 'standard' ? 2000 : 1000), 'ROSTER_FORMAT', 'La raza, escala o límite no coincide con el torneo.');
    const catalog = t.catalogs[list.race];
    // Validate the actual roster against the event snapshot; a version label alone does not make it illegal.
    const index = buildCatalogIndex(catalog); const validation = validateList(list, index);
    check(validation.legal && list.missionCardIds.length === 2 && list.deploymentCardIds.length === 2, 'ILLEGAL_ROSTER', validation.errors.map((e) => e.message.es).join(' ') || 'La lista necesita dos misiones y dos despliegues.');
    const lines = [list.name, list.race, index.factionCards.get(list.factionCardId!)!.name];
    for (const e of list.entries) {
      const unit = index.unitEntries.get(e.unitEntryId)!; const composition = unit.compositions.find((c) => c.id === e.compositionId)!;
      lines.push(`${unit.name} × ${composition.models} | ${entryMineralCost(index, e)} minerals | ${entrySlotUsage(index, e)?.amount ?? 0} supply`, ...e.upgrades.map((u) => `  ${unit.upgrades.find((v) => v.id === u.upgradeId)?.name ?? u.upgradeId}${u.modelIndex === null ? '' : ` (model ${u.modelIndex + 1})`}`));
    }
    for (const id of [...list.tacticalCardIds, ...list.missionCardIds, ...list.deploymentCardIds]) { const card = index.tacticalCards.get(id); lines.push(card ? `${card.name} · ${card.vespeneCost} gas` : index.missionCards.get(id)?.name ?? index.deploymentCards.get(id)?.name ?? id); }
    if (list.creepCardId) lines.push(index.creepCards.get(list.creepCardId)?.name ?? list.creepCardId);
    lines.push(`${validation.summary.mineralsSpent} minerals · ${validation.summary.vespeneSpent} gas · ${validation.summary.totalSupply} supply`);
    if (command.type === 'CORRECT_ROSTER') entrant.rosterHistory = [...(entrant.rosterHistory ?? []), ...entrant.rosters.filter((r) => r.slot === command.slot)];
    entrant.rosters = [...entrant.rosters.filter((r) => r.slot !== command.slot), { id: randomUUID(), slot: command.slot, list: structuredClone(list), text: lines.join('\n'), submittedAt: now, approved: command.type === 'CORRECT_ROSTER' }].sort((a, b) => a.slot - b.slot);
  } else if (command.type === 'APPROVE') {
    requireOwner(t, actor); beforeStart(); const roster = player(command.playerId).rosters.find((r) => r.id === command.rosterId);
    check(roster, 'ROSTER_NOT_FOUND', 'No existe esa lista.'); roster.approved = command.approved;
  } else if (command.type === 'START') {
    requireOwner(t, actor); check(t.status === 'PUBLISHED', 'TOURNAMENT_STATE', 'Publica el torneo antes de iniciarlo.');
    const entrants = t.players.filter((p) => p.status === 'ACTIVE');
    check(entrants.length >= (t.config.kind === 'COMPETITIVE' ? 12 : 2), 'PLAYER_COUNT', 'No hay suficientes participantes.');
    check(entrants.every((p) => p.checkedIn), 'CHECK_IN_REQUIRED', 'Todos los participantes deben confirmar asistencia antes de iniciar el torneo.');
    if (t.config.kind === 'COMPETITIVE') check(entrants.every((p) => p.rosters.length > 0 && p.rosters.every((r) => r.approved)), 'PLAYERS_NOT_READY', 'En torneos competitivos todos los participantes deben tener listas aprobadas.');
    t.status = 'IN_PROGRESS'; t.invitationHash = null; t.invitationExpiresAt = null;
  } else if (command.type === 'GENERATE') {
    requireOwner(t, actor); active(); check(!round || round.status === 'CLOSED' || round.status === 'DRAFT', 'ROUND_UNFINISHED', 'Cierra la ronda actual.');
    if (round?.status === 'DRAFT') t.rounds.pop();
    check(t.rounds.every((r) => r.matches.every((m) => m.result && !m.disputed)), 'ROUND_UNFINISHED', 'Resuelve los resultados anteriores.');
    check(t.rounds.length < t.config.rounds, 'ROUND_LIMIT', 'Ya se han jugado las rondas previstas.');
    const seed = randomInt(0, 2147483647); const generated = swissPairings(t, seed);
    check(generated.pairs.length > 0, 'PLAYER_COUNT', 'No hay jugadores activos.');
    t.rounds.push({ number: t.rounds.length + 1, status: 'DRAFT', seed, warning: generated.warning, startedAt: null, matches: generated.pairs.map((players, i) => ({ id: randomUUID(), table: i + 1, players, result: players[1] ? null : { vp: [0, 0], end: 'BYE', winner: 0, actor, at: now, reason: '' }, disputed: false, rosterIds: [null, null] })) });
  } else if (command.type === 'EDIT_PAIRINGS') {
    requireOwner(t, actor); active();
    check(round && round.number === command.round && round.status !== 'CLOSED', 'ROUND_STATE', 'Solo puedes cambiar los emparejamientos de la última ronda abierta.');
    const ids = command.matches.map((m) => m.id);
    check(ids.length === round.matches.length && new Set(ids).size === ids.length && round.matches.every((m) => ids.includes(m.id)), 'PAIRING_REVIEW', 'Debes conservar todas las partidas de la ronda.');
    const oldPlayers = round.matches.flatMap((m) => m.players).filter((id): id is string => id !== null).sort();
    const newPlayers = command.matches.flatMap((m) => m.players).filter((id): id is string => id !== null).sort();
    check(new Set(newPlayers).size === newPlayers.length && JSON.stringify(oldPlayers) === JSON.stringify(newPlayers), 'PAIRING_REVIEW', 'Cada participante debe aparecer una sola vez. Intercambia los jugadores entre partidas.');
    check(new Set(command.matches.map((m) => m.table)).size === command.matches.length, 'PAIRING_REVIEW', 'Las mesas no pueden repetirse.');
    for (const edit of command.matches) {
      const match = round.matches.find((m) => m.id === edit.id)!;
      const changed = match.players.some((id, i) => id !== edit.players[i]);
      check(!changed || !match.result || match.result.end === 'BYE' || command.resetResults, 'PAIRING_REVIEW', 'Confirma que quieres borrar los resultados de las partidas cuyos jugadores cambien.');
    }
    for (const edit of command.matches) {
      const match = round.matches.find((m) => m.id === edit.id)!;
      if (match.players.some((id, i) => id !== edit.players[i])) {
        match.players = edit.players;
        match.rosterIds = [null, null]; match.disputed = false;
        match.result = edit.players[1] ? null : { vp: [0, 0], end: 'BYE', winner: 0, actor, at: now, reason: command.reason };
      }
      match.table = edit.table;
    }
  } else if (command.type === 'PUBLISH_ROUND' || command.type === 'START_ROUND' || command.type === 'CLOSE_ROUND') {
    requireOwner(t, actor); active(); check(round, 'ROUND_NOT_FOUND', 'No hay ronda.');
    if (command.type === 'PUBLISH_ROUND') { check(round.status === 'DRAFT' && (!round.warning || command.acceptWarning), 'PAIRING_REVIEW', 'Revisa los emparejamientos y acepta la excepción si existe.'); check(t.rounds.filter((r) => r !== round).every((r) => r.matches.every((m) => m.result && !m.disputed)), 'ROUND_UNFINISHED', 'Resuelve las disputas previas.'); round.status = 'PUBLISHED'; }
    if (command.type === 'START_ROUND') { check(round.status === 'PUBLISHED', 'ROUND_STATE', 'Publica la ronda primero.'); round.status = 'ACTIVE'; round.startedAt = now; }
    if (command.type === 'CLOSE_ROUND') { check(round.status === 'ACTIVE' && round.matches.every((m) => m.result && !m.disputed), 'ROUND_UNFINISHED', 'Faltan resultados o hay disputas.'); round.status = 'CLOSED'; }
  } else if (command.type === 'RESULT' || command.type === 'RESOLVE' || command.type === 'DISPUTE') {
    active(); const targetRound = t.rounds.find((r) => r.matches.some((m) => m.id === command.matchId)); const m = targetRound?.matches.find((v) => v.id === command.matchId);
    check(m && targetRound && m.players[1], 'MATCH_NOT_FOUND', 'No existe esa partida.');
    check(m.players.includes(actor) || canManageTournament(t, actor), 'TOURNAMENT_FORBIDDEN', 'No puedes gestionar esa partida.');
    check(targetRound.status === 'ACTIVE' || (command.type !== 'RESULT' && targetRound.status === 'CLOSED'), 'ROUND_STATE', 'La ronda no está activa.');
    if (command.type === 'DISPUTE') { check(m.result, 'RESULT_REQUIRED', 'No hay resultado registrado.'); m.disputed = true; }
    else {
      if (command.type === 'RESOLVE') {
        requireOwner(t, actor);
      } else check(!m.result, 'RESULT_EXISTS', 'El resultado ya está registrado. Solicita una corrección arbitral.');
      if (command.end === 'NO_SHOW') requireOwner(t, actor);
      if (command.end === 'GAME_LOSS') requireOwner(t, actor);
      check(command.end === 'NORMAL' || command.end === 'TIME' || command.winner !== null, 'WINNER_REQUIRED', 'Indica el ganador.');
      if (command.type === 'RESULT') {
        m.players.forEach((id, i) => {
          const p = player(id!); const rosterId = command.rosterIds[i];
          if (t.config.kind === 'COMMUNITY' && rosterId === null) return;
          check(p.rosters.some((r) => r.id === rosterId && (t.config.kind === 'COMMUNITY' || r.approved)), 'ROSTER_SELECTION', 'Selecciona una lista válida del participante; en torneos competitivos debe estar aprobada.');
        });
        m.rosterIds = command.rosterIds;
      }
      const missionId = command.missionId === undefined ? m.result?.mission?.id : command.missionId;
      const mission = missionId ? t.catalogs.ZERG.missionCards.find((card) => card.id === missionId && card.scale === t.config.scale) : undefined;
      check(!missionId || mission, 'MISSION_INVALID', 'Selecciona una misión válida para el valor de las listas de este torneo.');
      check(!['NORMAL', 'TIME'].includes(command.end) || mission, 'MISSION_REQUIRED', 'Indica la misión jugada antes de guardar el resultado.');
      m.result = { vp: command.vp, end: command.end, winner: command.winner, actor, at: now, reason: command.reason, ...(mission ? { mission: { id: mission.id, name: mission.name } } : {}) };
      tournamentScore(m.result, t.config.scale); m.disputed = false;
      if (command.end === 'NO_SHOW') player(m.players[command.winner === 0 ? 1 : 0]!).status = 'WITHDRAWN';
    }
    if (round?.status === 'DRAFT' && round !== targetRound) t.rounds.pop();
  } else if (command.type === 'PENALTY') {
    active(); requireOwner(t, actor); const p = player(command.playerId);
    if (command.penalty === 'DISQUALIFICATION') {
      p.status = 'DISQUALIFIED';
    }
    if (command.penalty === 'GAME_LOSS' || command.penalty === 'DISQUALIFICATION') {
      const match = round?.status === 'ACTIVE' ? round.matches.find((m) => m.players.includes(p.id) && !m.result && m.players[1]) : null;
      if (match) { match.result = { vp: [0, 0], end: 'GAME_LOSS', winner: match.players[0] === p.id ? 1 : 0, actor, at: now, reason: command.reason }; match.disputed = false; }
      else check(command.penalty !== 'GAME_LOSS', 'MATCH_NOT_FOUND', 'No hay partida activa pendiente.');
    }
    t.penalties.push({ playerId: p.id, type: command.penalty, reason: command.reason, actor, at: now });
  } else if (command.type === 'APPROVE_DQ') {
    requireOwner(t, actor); active(); const sanction = t.penalties[command.index];
    check(sanction?.pending && sanction.type === 'DISQUALIFICATION', 'PENALTY_NOT_FOUND', 'No hay descalificación pendiente.');
    const p = player(sanction.playerId); p.status = 'DISQUALIFIED'; sanction.pending = false; sanction.approvedBy = actor;
    const match = round?.status === 'ACTIVE' ? round.matches.find((m) => m.players.includes(p.id) && !m.result && m.players[1]) : null;
    if (match) match.result = { vp: [0, 0], end: 'GAME_LOSS', winner: match.players[0] === p.id ? 1 : 0, actor: sanction.actor, at: now, reason: sanction.reason };
  } else if (command.type === 'COMPLETE') {
    check(!t.penalties.some((p) => p.pending), 'PENALTY_PENDING', 'Hay sanciones pendientes de acuerdo.');
    requireOwner(t, actor); active(); check(t.rounds.length === t.config.rounds && t.rounds.every((r) => r.status === 'CLOSED' && r.matches.every((m) => m.result && !m.disputed)), 'ROUND_UNFINISHED', 'Completa todas las rondas y resuelve las disputas.'); t.status = 'COMPLETED';
  } else if (command.type === 'CANCEL') { requireOwner(t, actor); check(!['COMPLETED', 'CANCELLED'].includes(t.status), 'TOURNAMENT_STATE', 'El torneo está cerrado.'); t.status = 'CANCELLED'; t.invitationHash = null; }
  else if (command.type === 'REOPEN') {
    requireOwner(t, actor);
    check(t.status === 'COMPLETED', 'TOURNAMENT_STATE', 'Solo se reabre un torneo terminado.');
    check(!tournamentPastCloseDeadline(t.config, Date.parse(now)), 'REOPEN_DEADLINE', 'No se puede reabrir pasadas 48 horas desde el fin del torneo.');
    t.status = 'IN_PROGRESS';
  }
  return {};
}
