import { GAME_TERM_DETAILS_A } from './gameTermDetailsA';
import { GAME_TERM_DETAILS_B } from './gameTermDetailsB';

export interface GameTermDetail {
  es: readonly string[];
  en: readonly string[];
}

export const GAME_TERM_DETAILS: Readonly<Record<string, GameTermDetail>> = {
  ...GAME_TERM_DETAILS_A,
  ...GAME_TERM_DETAILS_B,
};
