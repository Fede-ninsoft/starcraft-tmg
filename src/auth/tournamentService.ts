import { apiBaseUrl } from './apiBase';
import i18n from '@/i18n/config';
import type { Standing, Tournament, TournamentConfig } from '@/engine/tournaments';
import type { TournamentCommand } from '../../server/src/modules/tournaments/tournament.schema';
export interface TournamentResponse { tournament: Tournament; standings: Standing[]; token?: string }
export type TournamentSummary = Pick<Tournament, 'id' | 'ownerId' | 'ownerName' | 'status' | 'config'> & { playerCount: number; isRegistered: boolean };
const englishErrors: Record<string, string> = {
  MISSION_INVALID: 'Choose a mission valid for the roster format of this tournament.',
  MISSION_REQUIRED: 'Select the mission played before saving the result.',
  CHECK_IN_REQUIRED: 'All players must check in before the tournament starts.',
  GUEST_REQUIRED: 'This action is only available for guest players.',
  UNAUTHENTICATED: 'Sign in to continue.', EMAIL_NOT_VERIFIED: 'Verify your email first.',
  TOURNAMENT_NOT_FOUND: 'This tournament could not be found.', TOURNAMENT_FORBIDDEN: 'You do not have permission for this action.',
  TOURNAMENT_CONFLICT: 'The tournament has changed. Refresh before trying again.', TOURNAMENT_STATE: 'This action is unavailable in the current event state.',
  REGISTRATION_CLOSED: 'Registration has closed.', ALREADY_REGISTERED: 'You are already registered.', CAPACITY: 'There are no available seats, or capacity is below current registration.',
  INVITATION_REQUIRED: 'Open a valid private invitation link.', COMPETITIVE_STAFF: 'Competitive event staff cannot compete.',
  NOT_REGISTERED: 'Join the tournament first.', ROSTER_DEADLINE: 'The roster deadline has passed. The organiser can extend it.',
  ROSTER_FORMAT: 'Race, scale and points limit must match the event.', ILLEGAL_ROSTER: 'The roster is not legal. Check it in the builder; two missions and two deployments are required.',
  CATALOG_VERSION: 'The roster was saved with a different catalog version from the one fixed for this tournament. The catalog contains units, cards and their values. Review the roster version and tournament rules with the organiser before submitting again. Refreshing the page does not change these versions.', SINGLE_LIST: 'This event allows only one roster.',
  LIST_NOT_FOUND: 'Choose a saved roster from the player account.', ROSTER_NOT_FOUND: 'The submitted roster was not found.',
  PLAYERS_NOT_READY: 'All entrants must check in and have their rosters approved.', PLAYER_COUNT: 'There are not enough active players for this format.',
  HEAD_JUDGE_REQUIRED: 'An impartial head judge is required for this action.', JUDGE_ACCOUNT: 'The judge must have an active, verified account.',
  HEAD_JUDGE_EXISTS: 'A head judge has already been assigned.', ROSTERS_LOCK_CONFIG: 'Submitted rosters lock the scale, format and rules cutoff.',
  ROUND_UNFINISHED: 'Record all results and resolve outstanding disputes first.', ROUND_LIMIT: 'All scheduled rounds have been played.',
  ROUND_STATE: 'The round is not in the required state.', ROUND_NOT_FOUND: 'Generate a round first.',
  RESULT_EXISTS: 'A result has already been recorded. Ask a judge to correct it.', PENDING_MATCH: 'Resolve the current match before continuing.',
  ROSTER_SELECTION: 'Select the approved rosters used in this match.', IMPARTIAL_JUDGE: 'Another judge must resolve your own match or penalty.',
  INVALID_INPUT: 'Review the form fields and format requirements.',
  ROUND_COUNT_LOCKED: 'Round-count changes are no longer allowed, or would remove a published round.',
};
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(`${apiBaseUrl}/tournaments${path}`, { ...init, credentials: 'include', cache: 'no-store', headers: { 'Content-Type': 'application/json', ...init?.headers } }); }
  catch { throw new Error(i18n.language.startsWith('en') ? 'Cannot reach the server. Check your connection and refresh.' : 'No se puede conectar con el servidor. Comprueba la conexión y actualiza.'); }
  const payload = await response.json();
  if (!response.ok) throw new Error(i18n.language.startsWith('en') ? englishErrors[payload.error?.code] ?? 'The action could not be completed. Check the event state and your permissions.' : payload.error?.message || 'No se pudo completar la solicitud.');
  return payload as T;
}
export const listTournaments = (offset = 0, period: 'all' | 'current' | 'past' | 'future' = 'all') => request<{ tournaments: TournamentSummary[]; nextOffset: number | null }>(`?offset=${offset}&period=${period}`);
export const getTournament = (id: string) => request<TournamentResponse>(`/${encodeURIComponent(id)}`);
export const createTournament = (config: TournamentConfig) => request<TournamentResponse>('', { method: 'POST', body: JSON.stringify(config) });
export const tournamentCommand = (t: Tournament, command: TournamentCommand) => request<TournamentResponse>(`/${t.id}/commands`, { method: 'POST', headers: { 'If-Match': String(t.revision) }, body: JSON.stringify(command) });
export const getTournamentAudit = (id: string) => request<{ audit: unknown[] }>(`/${id}/audit`);
