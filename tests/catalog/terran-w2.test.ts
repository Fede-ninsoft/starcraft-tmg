import { describe, expect, it } from 'vitest';
import { indexFor } from '../fixtures';

describe('Cartas Terran W2', () => {
  it('activa las dos mejoras del Siege Tank al declarar un ataque a distancia en SIEGE MODE', () => {
    const index = indexFor('TERRAN');
    const entry = index.unitEntries.get('terran.entry.siege_tank')!;
    const card = index.unitCards.get(entry.cardId)!;

    expect(entry).toMatchObject({ slotType: 'ELITE', combatRole: { en: 'Damage Dealer' } });
    expect(card.weapons.map(({ name }) => name)).toEqual(['Twin Cannon', 'Shock Cannon', 'Rolling Over']);

    const shapedBlast = entry.upgrades.find(({ id }) => id === 'shaped_blast')!.grantsAbilities[0]!;
    const smartShells = entry.upgrades.find(({ id }) => id === 'smart_shells')!.grantsAbilities[0]!;
    for (const ability of [shapedBlast, smartShells]) {
      expect(ability).toMatchObject({ phase: 'ASSAULT', type: 'REACTION', cost: 0, resource: 'CP' });
      expect(ability.text.en).toContain('Once per Game. When this Unit declares a Ranged Attack action.');
      expect(ability.text.en).toContain('If this Unit has SIEGE MODE Status');
      expect(ability.text.es).toContain('declara una acción de Ataque a Distancia');
    }
    expect(shapedBlast.text.en).toContain('PINPOINT and LOCKED IN (4)');
    expect(smartShells.text.en).toContain('INDIRECT FIRE and LONG RANGE (24)');
  });

  it('conserva las habilidades y el suministro de Factory (Tech Lab)', () => {
    const factory = indexFor('TERRAN').tacticalCards.get('terran.tactical.factory_tech_lab')!;
    expect(factory).toMatchObject({
      vespeneCost: 40,
      unique: true,
      slotsGranted: { ELITE: 2 },
      resource: 'CP',
      resourcePerRound: 1,
    });
    expect(factory.abilities.map(({ name, phase, type, text }) => ({ name, phase, type, text: text.en }))).toEqual([
      {
        name: 'Field Repair',
        phase: 'MOVEMENT',
        type: 'ACTIVE',
        text: 'The active Mechanical Unit resolves the HEAL (2) effect.',
      },
      {
        name: "Pound 'Em Flat!",
        phase: 'ASSAULT',
        type: 'ACTIVE',
        text: 'If the active Mechanical Unit has the Stationary Status, its first Ranged Weapon used gains PRECISION (2).',
      },
    ]);
  });
});
