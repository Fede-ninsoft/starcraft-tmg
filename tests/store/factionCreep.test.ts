import { beforeEach, describe, expect, it } from 'vitest';
import { useListStore } from '@/store/listStore';

describe('Creep Card al cambiar de facción Zerg', () => {
  beforeEach(() => {
    useListStore.getState().resetForRace('ZERG');
  });

  it('retira Malignant Creep al pasar de Kerrigan’s Swarm a Zerg Swarm', () => {
    useListStore.getState().selectFactionCard('zerg.faction.kerrigans_swarm');
    useListStore.getState().selectCreepCard('zerg.creep.malignant_creep');

    useListStore.getState().selectFactionCard('zerg.faction.zerg_swarm');

    expect(useListStore.getState().list.creepCardId).toBeNull();
    expect(useListStore.getState().validation.errors.map((issue) => issue.rule)).toContain('R11');
  });

  it('conserva Accelerating Creep al pasar de Zerg Swarm a Kerrigan’s Swarm', () => {
    useListStore.getState().selectFactionCard('zerg.faction.zerg_swarm');
    useListStore.getState().selectCreepCard('zerg.creep.accelerating_creep');

    useListStore.getState().selectFactionCard('zerg.faction.kerrigans_swarm');

    expect(useListStore.getState().list.creepCardId).toBe('zerg.creep.accelerating_creep');
    expect(useListStore.getState().validation.errors.map((issue) => issue.rule)).not.toContain('R3');
    expect(useListStore.getState().validation.errors.map((issue) => issue.rule)).not.toContain('R11');
  });
});
