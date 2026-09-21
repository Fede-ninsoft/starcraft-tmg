import { describe, expect, it } from 'vitest';
import { entry, indexFor, emptyList } from '../fixtures';
import { entryMineralCost, computeCosts } from '@/engine/costing';
import { getEligibleUnits } from '@/engine/eligibility';

describe('Cartas v1.06.26 y capturas recibidas el 21 de septiembre', () => {
  it('incluye Zeratul como héroe único de 230 minerales sin mejoras', () => {
    const index = indexFor('PROTOSS');
    const unit = index.unitEntries.get('protoss.entry.zeratul')!;
    expect(unit).toMatchObject({ slotType: 'HERO', unique: true, tags: ['PROTOSS'], upgrades: [], compositions: [{ id: '1', models: 1, mineralCost: 230, supplyValue: 1 }] });
    const card = index.unitCards.get(unit.cardId)!;
    expect(card.baseSize).toBe(index.unitCards.get('protoss.card.artanis')!.baseSize);
    expect(card.imageRefFront).toBe('cards/protoss/unit-zeratul-front.webp');
    expect(card.imageRefBack).toBeUndefined();
    expect(card.weapons[0]).toMatchObject({ name: 'Master Warp Blade', rateOfAttack: '4', damage: '2', keywords: ['INSTANT'] });
    expect(card.abilities).toHaveLength(7);
    const list = emptyList({ race: 'PROTOSS', factionCardId: 'protoss.faction.nerazim' });
    expect(getEligibleUnits(list, index).find(u => u.entry.id === unit.id)?.status).toBe('available');
    expect(getEligibleUnits({ ...list, entries: [entry(unit.id, '1')] }, index).find(u => u.entry.id === unit.id)?.constraint).toBe('UNIQUE_ALREADY_INCLUDED');
  });

  it('recluta Watchers como Core Nerazim sin heredar armas o mejoras de Adept', () => {
    const index = indexFor('PROTOSS');
    const unit = index.unitEntries.get('protoss.entry.nerazim_watchers')!;
    expect(unit).toMatchObject({ slotType: 'CORE', unique: false, upgrades: [], compositions: [{ id: '4', models: 4, mineralCost: 210, supplyValue: 1 }] });
    const card = index.unitCards.get(unit.cardId)!;
    expect(card.baseSize).toBe(index.unitCards.get('protoss.card.adept')!.baseSize);
    expect(card.imageRefFront).toBe('cards/protoss/unit-nerazim-watchers-front.webp');
    expect(card.imageRefBack).toBeUndefined();
    expect(card.weapons[0]).toMatchObject({ rateOfAttack: '3', keywords: ['ANTI-EVADE (1)', 'PINPOINT'] });
    expect(card.weapons[1]).toMatchObject({ hit: '5+' });
    expect(card.abilities.map(a => a.name)).toEqual(['Path of Shadows', 'Nerazim Farsight', 'Psionic Transfer']);
    const status = (factionCardId: string) => getEligibleUnits(emptyList({ race: 'PROTOSS', factionCardId }), index).find(u => u.entry.id === unit.id)?.status;
    expect(status('protoss.faction.nerazim')).toBe('available');
    expect(status('protoss.faction.khalai')).toBe('impossible');
  });

  it('incorpora costes, recursos, espacios y unicidad de las tres tácticas', () => {
    const protoss = indexFor('PROTOSS');
    expect(protoss.tacticalCards.get('protoss.tactical.robotics_facility')).toMatchObject({ vespeneCost: 35, slotsGranted: { ELITE: 2 }, unique: false, resource: 'PE', resourcePerRound: 1 });
    expect(protoss.tacticalCards.get('protoss.tactical.void_seeker')).toMatchObject({ vespeneCost: 40, slotsGranted: { CORE: 1 }, unique: true, tags: ['PROTOSS', 'NERAZIM'], resource: 'PE', resourcePerRound: 1 });
    expect(indexFor('TERRAN').tacticalCards.get('terran.tactical.factory_tech_lab')).toMatchObject({ vespeneCost: 40, slotsGranted: { ELITE: 2 }, unique: true, resource: 'CP', resourcePerRound: 1 });
  });

  it('reproduce ambos Ravager de la captura sin contar dos veces las mejoras', () => {
    const index = indexFor('ZERG');
    const upgrades = ['bloated_bile_ducts', 'burrow_ambush', 'potent_bile'].map(upgradeId => ({ upgradeId, modelIndex: null }));
    expect(entryMineralCost(index, entry('zerg.entry.ravager', '1'))).toBe(160);
    expect(entryMineralCost(index, entry('zerg.entry.ravager', '1', upgrades))).toBe(220);
    expect(entryMineralCost(index, entry('zerg.entry.ravager', '2'))).toBe(270);
    expect(entryMineralCost(index, entry('zerg.entry.ravager', '2', upgrades))).toBe(390);
    expect(index.unitCards.get('zerg.card.ravager')?.profile).toMatchObject({ speed: '4/8', hitPoints: '9', size: '3' });
  });

  it('conserva los costes de Siege Tank y sus cuatro mejoras', () => {
    const index = indexFor('TERRAN');
    const unit = index.unitEntries.get('terran.entry.siege_tank')!;
    expect(unit.compositions).toEqual([{ id: '1', models: 1, mineralCost: 220, supplyValue: 2 }]);
    expect(unit.upgrades.map(u => u.costByComposition['1'])).toEqual([20, 20, 10, 10]);
    expect(entryMineralCost(index, entry(unit.id, '1', unit.upgrades.map(u => ({ upgradeId: u.id, modelIndex: null }))))).toBe(280);
    expect(index.unitCards.get(unit.cardId)?.weapons.find(w => w.name === 'Shock Cannon')).toMatchObject({ rateOfAttack: 'BT+4', surgeDice: 'BT', damage: '1' });
    expect(unit.upgrades.find(u => u.id === 'mode_transformation')?.grantsAbilities[0]).toMatchObject({ cost: 1, resource: 'CP', phase: 'MOVEMENT' });
  });

  it('reemplaza cada arma del Immortal de forma independiente y conserva SIDEARM', () => {
    const index = indexFor('PROTOSS');
    const unit = index.unitEntries.get('protoss.entry.immortal')!;
    expect(unit.compositions[0]).toMatchObject({ mineralCost: 280, supplyValue: 2 });
    expect(unit.upgrades.map(u => u.costByComposition['1'])).toEqual([20, 20, 20, 20, 20]);
    const left = unit.upgrades.find(u => u.id === 'left_phase_disruptor')!;
    const right = unit.upgrades.find(u => u.id === 'right_phase_disruptor')!;
    expect(left.replacesWeapon).toBe('Left Photon Disruptor');
    expect(right.replacesWeapon).toBe('Right Photon Disruptor');
    expect(left.grantsWeapons[0]).toMatchObject({ damage: '1', keywords: ['PIERCE Armoured (3)'] });
    expect(right.grantsWeapons[0]).toMatchObject({ damage: '1', keywords: ['PIERCE Armoured (3)', 'SIDEARM'] });
    expect(entryMineralCost(index, entry(unit.id, '1', [{ upgradeId: left.id, modelIndex: null }, { upgradeId: right.id, modelIndex: null }]))).toBe(320);
  });

  it('Nerazim aporta los espacios y recursos impresos y permite reclutar Immortal', () => {
    const index = indexFor('PROTOSS');
    const faction = index.factionCards.get('protoss.faction.nerazim')!;
    expect(faction).toMatchObject({ startingSlots: { CORE: 2, ELITE: 3, HERO: 1 }, resourcePerRound: 1, tags: ['PROTOSS', 'NERAZIM'] });
    const list = emptyList({ race: 'PROTOSS', factionCardId: faction.id });
    expect(getEligibleUnits(list, index).find(e => e.entry.id === 'protoss.entry.immortal')?.status).toBe('available');
  });

  it('Cocoon cuesta 30 gas, aporta un espacio élite y no genera biomasa', () => {
    const index = indexFor('ZERG');
    expect(index.tacticalCards.get('zerg.tactical.cocoon')).toMatchObject({ vespeneCost: 30, slotsGranted: { ELITE: 1 }, unique: true, resource: null, resourcePerRound: 0 });
    const list = emptyList({ race: 'ZERG', factionCardId: 'zerg.faction.zerg_swarm', tacticalCardIds: ['zerg.tactical.cocoon'] });
    const withCard = computeCosts(list, index);
    const withoutCard = computeCosts({ ...list, tacticalCardIds: [] }, index);
    expect(withCard.resourcePerRound).toEqual(withoutCard.resourcePerRound);
  });
});
