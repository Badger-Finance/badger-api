/**
 * Values are APR at various time sampled intervals.
 * i.e. sevenDay represents the APR over the past
 * seven days.
 */
export interface Performance {
  oneDay: number;
  threeDay: number;
  sevenDay: number;
  thirtyDay: number;
  harvestable?: boolean;
}

export const uniformPerformance = (apr: number): Performance => {
  return {
    oneDay: apr,
    threeDay: apr,
    sevenDay: apr,
    thirtyDay: apr,
  };
};

export const combinePerformance = (performances: Performance[], filterHarvestablePerformances?: boolean) => {
  const basePerformance = uniformPerformance(0);
  for (const performance of performances) {
    if (filterHarvestablePerformances && performance.harvestable) {
      continue;
    }
    basePerformance.oneDay += performance.oneDay;
    basePerformance.threeDay += performance.threeDay;
    basePerformance.sevenDay += performance.sevenDay;
    basePerformance.thirtyDay += performance.thirtyDay;
  }
  return basePerformance;
};
