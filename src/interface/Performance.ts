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

export const combinePerformance = (...performances: Performance[]) => {
	const basePerformance = uniformPerformance(0);
	performances.forEach((p) => {
		basePerformance.oneDay += p.oneDay;
		basePerformance.threeDay += p.threeDay;
		basePerformance.sevenDay += p.sevenDay;
		basePerformance.thirtyDay += p.thirtyDay;
	});
	return basePerformance;
};
