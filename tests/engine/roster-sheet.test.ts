import { describe, expect, it } from 'vitest';
import { rosterSheetData } from '../../src/ui/tournaments/RosterSheet';
import { manualExampleList } from '../fixtures';
import type { TournamentRoster } from '../../src/engine/tournaments';

describe('tournament roster presentation', () => {
  it('groups saved units, upgrades and cards without consulting the current catalog', () => {
    const list = manualExampleList();
    list.entries = [list.entries[0]!];
    const upgrades = list.entries[0]!.upgrades.map((_, i) => `  Historical upgrade ${i}`);
    const tactics = list.tacticalCardIds.map((_, i) => `Historical tactic ${i} · 15 gas`);
    const missions = list.missionCardIds.map((_, i) => `Historical mission ${i}`);
    const deployments = list.deploymentCardIds.map((_, i) => `Historical deployment ${i}`);
    list.creepCardId = null;
    const roster: TournamentRoster = { id: 'snapshot', slot: 1, list, approved: true, submittedAt: '2030-01-01T00:00:00Z', text: [list.name, list.race, 'Historical faction', 'Historical unit × 6 | 180 minerals | 2 supply', ...upgrades, ...tactics, ...missions, ...deployments, '180 minerals · 45 gas · 2 supply'].join('\r\n') };
    const data = rosterSheetData(roster);
    expect(data.faction).toBe('Historical faction');
    expect(data.units[0]).toEqual({ name: 'Historical unit', models: '6', minerals: '180', supply: '2', upgrades: upgrades.map((v) => v.trim()) });
    expect(data.tactics).toEqual(tactics);
    expect(data.missions).toEqual(missions);
    expect(data.deployments).toEqual(deployments);
    expect(data.totals).toEqual(['180', '45', '2']);
  });
});
