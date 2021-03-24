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
}

export const uniformPerformance = (apr: number): Performance => {
  return {
    oneDay: apr,
    threeDay: apr,
    sevenDay: apr,
    thirtyDay: apr,
  };
};

export const scalePerformance = (performance: Performance, scalar: number): Performance => {
  return {
    oneDay: performance.oneDay * scalar,
    threeDay: performance.threeDay * scalar,
    sevenDay: performance.sevenDay * scalar,
    thirtyDay: performance.thirtyDay * scalar,
  };
};
