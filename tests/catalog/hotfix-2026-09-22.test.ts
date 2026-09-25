import { describe, expect, it } from 'vitest';
import { getEligibleCreepCards, getEligibleTacticalCards, getEligibleUnits } from '@/engine/eligibility';
import type { Race } from '@/engine/types';
import { emptyList, indexFor } from '../fixtures';

const FACTION_UNITS: Array<{
  race: Race;
  unitId: string;
  allowedFaction: string;
  excludedFactions: string[];
}> = [
  {
    race: 'ZERG',
    unitId: 'zerg.entry.omega_worm',
    allowedFaction: 'zerg.faction.kerrigans_swarm',
    excludedFactions: ['zerg.faction.zerg_swarm'],
  },
  {
    race: 'ZERG',
    unitId: 'zerg.entry.kerrigan_swarm_raptor',
    allowedFaction: 'zerg.faction.kerrigans_swarm',
    excludedFactions: ['zerg.faction.zerg_swarm'],
  },
  {
    race: 'TERRAN',
    unitId: 'terran.entry.point_defense_drone',
    allowedFaction: 'terran.faction.raynors_raiders',
    excludedFactions: ['terran.faction.terran_armed_forces'],
  },
  {
    race: 'TERRAN',
    unitId: 'terran.entry.raynors_raider',
    allowedFaction: 'terran.faction.raynors_raiders',
    excludedFactions: ['terran.faction.terran_armed_forces'],
  },
  {
    race: 'PROTOSS',
    unitId: 'protoss.entry.pylon',
    allowedFaction: 'protoss.faction.khalai',
    excludedFactions: ['protoss.faction.daelaam', 'protoss.faction.nerazim'],
  },
  {
    race: 'PROTOSS',
    unitId: 'protoss.entry.praetor_guard',
    allowedFaction: 'protoss.faction.khalai',
    excludedFactions: ['protoss.faction.daelaam', 'protoss.faction.nerazim'],
  },
  {
    race: 'PROTOSS',
    unitId: 'protoss.entry.nerazim_watchers',
    allowedFaction: 'protoss.faction.nerazim',
    excludedFactions: ['protoss.faction.daelaam', 'protoss.faction.khalai'],
  },
];

describe('Hot fix del 22.09.2026: cartas exclusivas de facción', () => {
  it.each(FACTION_UNITS)('$unitId solo es elegible con $allowedFaction', ({ race, unitId, allowedFaction, excludedFactions }) => {
    const index = indexFor(race);
    const status = (factionCardId: string) => getEligibleUnits(
      emptyList({ race, factionCardId }), index,
    ).find((unit) => unit.entry.id === unitId)?.status;

    expect(status(allowedFaction)).toBe('available');
    for (const factionCardId of excludedFactions) {
      expect(status(factionCardId)).toBe('impossible');
    }
  });

  it('Malignant Creep solo aparece con Kerrigan’s Swarm', () => {
    const index = indexFor('ZERG');
    const availableIds = (factionCardId: string) => getEligibleCreepCards(
      emptyList({ race: 'ZERG', factionCardId }), index,
    ).map((candidate) => candidate.card.id);

    expect(availableIds('zerg.faction.kerrigans_swarm')).toContain('zerg.creep.malignant_creep');
    expect(availableIds('zerg.faction.zerg_swarm')).not.toContain('zerg.creep.malignant_creep');
  });

  it('Void Seeker solo es elegible con Nerazim', () => {
    const index = indexFor('PROTOSS');
    const status = (factionCardId: string) => getEligibleTacticalCards(
      emptyList({ race: 'PROTOSS', factionCardId }), index,
    ).find((candidate) => candidate.card.id === 'protoss.tactical.void_seeker')?.status;

    expect(status('protoss.faction.nerazim')).toBe('available');
    expect(status('protoss.faction.daelaam')).toBe('impossible');
    expect(status('protoss.faction.khalai')).toBe('impossible');
  });

  it('Twilight Council cuesta 45 de gas', () => {
    expect(indexFor('PROTOSS').tacticalCards.get('protoss.tactical.twilight_council')?.vespeneCost).toBe(45);
  });
});
