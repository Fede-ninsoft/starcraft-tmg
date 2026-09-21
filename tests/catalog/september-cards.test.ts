import { describe, expect, it } from 'vitest';
import { entry, indexFor, emptyList } from '../fixtures';
import { entryMineralCost, computeCosts } from '@/engine/costing';
import { getEligibleUnits } from '@/engine/eligibility';

describe('Cartas v1.06.26 y capturas recibidas el 21 de septiembre', () => {
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
