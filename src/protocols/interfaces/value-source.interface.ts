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

export function createValueSource(
  name: string,
  performance: Performance,
  harvestable?: boolean,
  boost?: BoostRange,
): ValueSource {
  const apr = selectPerformanceApr(performance);
  const evaluatedBoost = boost ?? { min: 1, max: 1 };
  const isBoostable = evaluatedBoost.min != evaluatedBoost.max;
  return {
    name,
    apr,
    performance,
    boostable: isBoostable,
    harvestable: !!harvestable,
    minApr: apr * evaluatedBoost.min,
    maxApr: apr * evaluatedBoost.max,
  };
}

function selectPerformanceApr(performance: Performance): number {
  const minApr = 0.01;
  if (performance.thirtyDay > minApr) {
    return performance.thirtyDay;
  }
  if (performance.sevenDay > minApr) {
    return performance.sevenDay;
  }
  if (performance.threeDay > minApr) {
    return performance.threeDay;
  }
  return performance.oneDay;
}
