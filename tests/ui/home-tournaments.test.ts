import { describe, expect, it } from 'vitest';
import type { TournamentSummary } from '@/auth/tournamentService';
import { selectHomeTournaments } from '@/ui/home/homeTournamentSelection';
import { tournamentConfig } from '../tournament-fixture';

const now = Date.parse('2030-10-20T12:00:00.000Z');
function entry(id: string, startsAt: string, endsAt: string, status: TournamentSummary['status'] = 'PUBLISHED', registrationMode: TournamentSummary['config']['registrationMode'] = 'OPEN'): TournamentSummary {
  return { id, ownerId: 'owner', ownerName: 'Organizer', status, config: { ...tournamentConfig, startsAt, endsAt, registrationMode }, playerCount: 4, isRegistered: false };
}

describe('home tournament selection', () => {
  it('shows public active tournaments by their nearest relevant date', () => {
    const entries = [
      entry('later', '2030-10-23T12:00:00.000Z', '2030-10-23T18:00:00.000Z'),
      entry('ongoing', '2030-10-20T08:00:00.000Z', '2030-10-20T14:00:00.000Z', 'IN_PROGRESS'),
      entry('next', '2030-10-20T13:00:00.000Z', '2030-10-20T18:00:00.000Z'),
      entry('private', '2030-10-20T12:30:00.000Z', '2030-10-20T18:00:00.000Z', 'PUBLISHED', 'INVITE_ONLY'),
      entry('finished', '2030-10-20T12:15:00.000Z', '2030-10-20T18:00:00.000Z', 'COMPLETED'),
      entry('cancelled', '2030-10-20T12:15:00.000Z', '2030-10-20T18:00:00.000Z', 'CANCELLED'),
      entry('expired', '2030-10-16T08:00:00.000Z', '2030-10-17T08:00:00.000Z', 'IN_PROGRESS'),
    ];
    expect(selectHomeTournaments(entries, now).map((event) => event.id)).toEqual(['next', 'ongoing', 'later']);
  });

  it('limits the list to eight events after sorting', () => {
    const entries = Array.from({ length: 12 }, (_, index) => entry(String(index), new Date(now + (index + 1) * 3600000).toISOString(), new Date(now + (index + 2) * 3600000).toISOString()));
    expect(selectHomeTournaments(entries.reverse(), now).map((event) => event.id)).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
  });
});
