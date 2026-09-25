/**
 * Links from glossary entries to the corresponding questions in the official FAQ.
 * `itemIndex` is zero-based within FAQ_SECTIONS; `pdfPage` is the PDF viewer page.
 * Only clarifications that directly affect a term's rule are included here.
 */
type FaqLink = { sectionId: string; itemIndex: number; pdfPage: number };

const refs = (sectionId: string, pdfPage: number, ...itemIndices: number[]): FaqLink[] =>
  itemIndices.map(itemIndex => ({ sectionId, itemIndex, pdfPage }));

const units = (...itemIndices: number[]) => refs('units-characteristics', 2, ...itemIndices);
const movement = (...itemIndices: number[]) => refs('measuring-movement', 2, ...itemIndices);
const battlefield = (...itemIndices: number[]) => refs('battlefield', 2, ...itemIndices);
const deployment = (...itemIndices: number[]) => refs('deployment', 3, ...itemIndices);
const attack = (...itemIndices: number[]) => refs('attack-sequence', 3, ...itemIndices);
const abilities = (...itemIndices: number[]): FaqLink[] => itemIndices.map(itemIndex => ({
  sectionId: 'abilities-tactics', itemIndex, pdfPage: itemIndex <= 3 ? 3 : 4,
}));
const keywords = (...itemIndices: number[]): FaqLink[] => itemIndices.map(itemIndex => ({
  sectionId: 'keywords', itemIndex, pdfPage: itemIndex <= 3 ? 4 : 5,
}));
const templates = (...itemIndices: number[]) => refs('templates-spillover', 5, ...itemIndices);

export const GAME_TERM_FAQ_LINKS: Record<string, readonly FaqLink[]> = {
  'access-point': movement(4),
  'anti-evade': attack(1),
  'batch': [...attack(5), ...keywords(7, 8), ...templates(2, 3)],
  'buff': abilities(6),
  'burrowed': battlefield(4),
  'combat-tags': templates(0, 1),
  'critical-hit': [...keywords(7), ...templates(3)],
  'current-supply-value': [...keywords(9, 10)],
  'elevation-level': [...movement(4, 9), ...templates(0, 1)],
  'engaged': [...movement(2), ...attack(3, 4), ...keywords(0)],
  'engagement-range': deployment(4),
  'entry-edge': deployment(0, 1, 2, 3),
  'evade-roll': [...attack(0, 1), ...keywords(3)],
  'first-player-marker': abilities(15),
  'flying': [...battlefield(4), ...templates(0, 1)],
  'heal': [...units(0, 1), ...abilities(9)],
  'hidden': [...battlefield(4), ...keywords(4)],
  'high-ground': [...movement(4, 7, 8, 9), ...deployment(0)],
  'impact': abilities(5),
  'impassable-terrain': movement(8),
  'indirect-fire': keywords(3),
  'leading-model': [...movement(3, 4, 6), ...deployment(4)],
  'line-of-sight': [...battlefield(0), ...attack(2), ...abilities(4), ...keywords(3)],
  'locked-in': keywords(2),
  'mission-markers': [...movement(0), ...battlefield(1, 4), ...abilities(18)],
  'modifier': [...attack(1), ...abilities(5, 6)],
  'morph': keywords(9, 10),
  'non-lethal-damage': units(2),
  'on-creep': [...deployment(7), ...abilities(13)],
  'pinpoint': keywords(0),
  'place': [...abilities(8, 11), ...keywords(1)],
  'precision': [...keywords(7, 8), ...templates(3)],
  'ready': [...abilities(0, 14)],
  'repeatable': keywords(6),
  'reserves': deployment(5, 7),
  'shielded': units(0, 1, 2),
  'special-ability': [...deployment(5, 6), ...abilities(0, 2, 3, 15, 16, 17)],
  'specialist': keywords(11),
  'spillover': templates(0, 1, 2, 3),
  'stationary': keywords(2),
  'supply-value': keywords(9, 10),
  'surge': [...attack(0), ...keywords(7)],
  'unit-coherency': [...movement(0, 2, 3, 4), ...deployment(0, 4)],
  'victory-points': keywords(9, 10),
  'visible': [...attack(2), ...keywords(3)],
  'within': [...battlefield(0), ...abilities(1), ...keywords(5)],
  'zone-of-influence': deployment(3),
  'activation': [...deployment(2), ...abilities(2, 3, 15), ...keywords(6)],
};
