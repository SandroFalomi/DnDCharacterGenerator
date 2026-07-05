import { PointBuyCost, StandardArraySet } from '../core/models/content.model';

export const STANDARD_ARRAYS: StandardArraySet[] = [
  { name: 'Array Standard', values: [15, 14, 13, 12, 10, 8] },
  { name: 'Eroe Equilibrato', values: [14, 14, 13, 12, 11, 10] },
  { name: 'Specialista', values: [16, 14, 12, 11, 10, 9] }
];

export const POINT_BUY_BUDGET = 27;

export const POINT_BUY_COSTS: PointBuyCost[] = [
  { score: 8, cost: 0 },
  { score: 9, cost: 1 },
  { score: 10, cost: 2 },
  { score: 11, cost: 3 },
  { score: 12, cost: 4 },
  { score: 13, cost: 5 },
  { score: 14, cost: 7 },
  { score: 15, cost: 9 }
];

export const ALIGNMENTS = [
  'Legale Buono', 'Neutrale Buono', 'Caotico Buono',
  'Legale Neutrale', 'Neutrale Puro', 'Caotico Neutrale',
  'Legale Malvagio', 'Neutrale Malvagio', 'Caotico Malvagio'
];
