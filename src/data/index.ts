import type { Ingrediente, Ricetta } from '../core/types';
import { INGREDIENTI } from './ingredienti';
import { RICETTE } from './ricette';

export const databaseBase: { ingredienti: Ingrediente[]; ricette: Ricetta[] } = {
  ingredienti: INGREDIENTI,
  ricette: RICETTE,
};

export { INGREDIENTI } from './ingredienti';
export { RICETTE } from './ricette';
