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
  return {
    name,
    apr,
    performance,
    boostable: !!boost,
    harvestable: !!harvestable,
    minApr: apr * evaluatedBoost.min,
    maxApr: apr * evaluatedBoost.max,
  };
}

function selectPerformanceApr(performance: Performance): number {
  if (performance.sevenDay > 0) {
    return performance.sevenDay;
  }
  if (performance.thirtyDay > 0) {
    return performance.thirtyDay;
  }
  if (performance.sevenDay > 0) {
    return performance.sevenDay;
  }
  return performance.oneDay;
}
