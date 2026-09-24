import { tournamentEndTime, tournamentPastCloseDeadline } from '@/engine/tournaments';
import type { TournamentSummary } from '@/auth/tournamentService';

function relevantDate(entry: TournamentSummary, now: number): number {
  const start = Date.parse(entry.config.startsAt);
  return start > now ? start : tournamentEndTime(entry.config);
}

/** Public, unfinished events nearest to their next meaningful date. */
export function selectHomeTournaments(entries: TournamentSummary[], now: number, limit = 8): TournamentSummary[] {
  return entries
    .filter((entry) =>
      entry.config.registrationMode === 'OPEN'
      && (entry.status === 'PUBLISHED' || entry.status === 'IN_PROGRESS')
      && !tournamentPastCloseDeadline(entry.config, now)
      && Number.isFinite(relevantDate(entry, now)))
    .sort((a, b) =>
      Math.abs(relevantDate(a, now) - now) - Math.abs(relevantDate(b, now) - now)
      || Date.parse(a.config.startsAt) - Date.parse(b.config.startsAt)
      || a.id.localeCompare(b.id))
    .slice(0, limit);
}
