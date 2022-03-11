import { BoostRange } from '../../rewards/interfaces/boost-range.interface';

export interface ValueSource {
  name: string;
  apr: number;
  boostable: boolean;
  minApr: number;
  maxApr: number;
}

export function createValueSource(name: string, apr: number, boost?: BoostRange): ValueSource {
  const evaluatedBoost = boost ?? { min: 1, max: 1 };
  const isBoostable = evaluatedBoost.min != evaluatedBoost.max;
  return {
    name,
    apr,
    boostable: isBoostable,
    minApr: apr * evaluatedBoost.min,
    maxApr: apr * evaluatedBoost.max,
  };
}
