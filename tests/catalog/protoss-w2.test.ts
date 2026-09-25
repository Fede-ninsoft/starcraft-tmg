import { describe, expect, it } from 'vitest';
import { indexFor } from '../fixtures';

const index = indexFor('PROTOSS');

describe('Cartas Protoss Wave 2, septiembre de 2026', () => {
  it('sitúa Void Blink en Asalto y exige que Zeratul no esté trabado', () => {
    const abilities = index.unitCards.get('protoss.card.zeratul')!.abilities;
    expect(abilities.find((ability) => ability.name === 'Void Blink')).toMatchObject({
      phase: 'ASSAULT',
      type: 'ACTIVE',
      cost: 1,
      resource: 'PE',
      text: {
        en: 'If Unengaged, resolve the PLACE (6) effect.',
        es: 'Si esta unidad no está trabada, resuelve el efecto PLACE (6).',
      },
    });
    expect(abilities.some((ability) => ability.name === 'Blink')).toBe(false);
  });

  it('fija la Evasión de Prophetic Vision y limita Farsight a su propia Shade', () => {
    const vision = index.unitCards.get('protoss.card.zeratul')!.abilities
      .find((ability) => ability.name === 'Prophetic Vision')!;
    expect(vision.text.en).toContain('cannot be modified');
    expect(vision.text.es).toContain('no puede modificarse');

    const farsight = index.unitCards.get('protoss.card.nerazim_watchers')!.abilities
      .find((ability) => ability.name === 'Nerazim Farsight')!;
    expect(farsight.text.en).toContain("this Unit's Shade token");
    expect(farsight.text.es).toContain('la ficha Shade de esta unidad');
  });

  it('identifica el rol impreso de Zeratul y los Nerazim Watchers', () => {
    for (const id of ['protoss.entry.zeratul', 'protoss.entry.nerazim_watchers']) {
      expect(index.unitEntries.get(id)!.combatRole).toEqual({
        en: 'Damage Dealer',
        es: 'Especialista en daño',
      });
    }
  });
});
