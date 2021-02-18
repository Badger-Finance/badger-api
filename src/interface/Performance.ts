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
