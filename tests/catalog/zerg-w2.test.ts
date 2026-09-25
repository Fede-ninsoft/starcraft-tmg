import { describe, expect, it } from 'vitest';
import { indexFor } from '../fixtures';

describe('Cartas Zerg W2', () => {
  const index = indexFor('ZERG');

  it('conserva el perfil y las fases de Ravager', () => {
    const entry = index.unitEntries.get('zerg.entry.ravager')!;
    const card = index.unitCards.get(entry.cardId)!;

    expect(entry).toMatchObject({
      slotType: 'CORE',
      combatRole: { en: 'Tactician', es: 'Táctico' },
      compositions: [
        { id: '1', models: 1, supplyValue: 1 },
        { id: '2', models: 2, supplyValue: 2 },
      ],
    });
    expect(card.baseSize).toBe('Ø 80MM');
    expect(card.abilities.map(({ name, phase, type, cost }) => ({ name, phase, type, cost }))).toEqual([
      { name: 'Squadron', phase: 'ANY', type: 'PASSIVE', cost: null },
      { name: 'Corrosive Bile', phase: 'MOVEMENT', type: 'ACTIVE', cost: 1 },
      { name: 'Deep Tunnel', phase: 'MOVEMENT', type: 'ACTIVE', cost: 1 },
      { name: 'Devastating Charge', phase: 'ASSAULT', type: 'PASSIVE', cost: null },
    ]);
  });

  it('incluye el orden de resolución simultánea de Corrosive Bile en ambos idiomas', () => {
    const bile = index.unitCards.get('zerg.card.ravager')!.abilities.find(({ name }) => name === 'Corrosive Bile')!;
    expect(bile.text.en).toContain('If multiple effects trigger at the End of the Assault Phase, resolve them in the order specified in Part 8.9.4.');
    expect(bile.text.es).toContain('Si se activan varios efectos al final de la Fase de Asalto, resuélvelos en el orden indicado en el apartado 8.9.4.');
  });

  it('mantiene las mejoras impresas de Ravager', () => {
    const entry = index.unitEntries.get('zerg.entry.ravager')!;
    expect(entry.upgrades.map(({ id, grantsAbilities }) => ({ id, phase: grantsAbilities[0]!.phase, type: grantsAbilities[0]!.type }))).toEqual([
      { id: 'bloated_bile_ducts', phase: 'ANY', type: 'PASSIVE' },
      { id: 'burrow_ambush', phase: 'MOVEMENT', type: 'PASSIVE' },
      { id: 'potent_bile', phase: 'ASSAULT', type: 'PASSIVE' },
    ]);
  });

  it('mantiene las dos habilidades de movimiento de Cocoon', () => {
    const cocoon = index.tacticalCards.get('zerg.tactical.cocoon')!;
    expect(cocoon).toMatchObject({
      unique: true,
      slotsGranted: { ELITE: 1 },
      abilities: [
        { name: 'Spawn Larva', phase: 'MOVEMENT', type: 'ACTIVE', cost: null },
        { name: 'Ravager Morph', phase: 'MOVEMENT', type: 'ACTIVE', cost: null },
      ],
    });
    expect(cocoon.abilities[0]!.text.en).toContain('RESPAWN (2)');
    expect(cocoon.abilities[1]!.text.en).toContain('Once per Game.');
  });
});
