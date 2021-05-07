import { BoostRange } from '../../rewards/interfaces/boost-range.interface';
import { Performance } from './performance.interface';

export interface ValueSource {
  name: string;
  apr: number;
  performance: Performance;
  boostable: boolean;
  harvestable: boolean;
  minApr: number;
  maxApr: number;
}

export const createValueSource = (
  name: string,
  performance: Performance,
  harvestable?: boolean,
  boost?: BoostRange,
): ValueSource => {
  const apr = Math.max(...Object.values(performance));
  const evaluatedBoost = boost ?? { min: 1, max: 1 };
  return {
    name,
    apr,
    performance,
    boostable: !!boost,
    harvestable: !!harvestable,
    minApr: apr * evaluatedBoost.min,
    maxApr: apr * evaluatedBoost.max,
  };
};
