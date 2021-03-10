import fetch from 'node-fetch';
import { Chain } from '../../config/chain';
import { Performance, uniformPerformance } from '../../interface/Performance';
import { SettData } from '../../service/setts';

export abstract class SwapService {
	constructor(private graphUrl: string) {}

	abstract getPairPerformance(chain: Chain, sett: SettData): Promise<Performance>;

	/**
	 * Retrieve Uniswap v2 variant pool performance from trading fees.
	 * @param poolAddress Liquidity pair contract address.
	 * @param protocol Uniswap v2 variant type.
	 */
	async getSwapPerformance(poolAddress: string): Promise<Performance> {
		// TODO: Move query to GraphService
		const query = `
      {
        pairDayDatas(first: 30, orderBy: date, orderDirection: desc, where:{pairAddress: "${poolAddress.toLowerCase()}"}) {
          reserveUSD
          dailyVolumeUSD
        }
      }
    `;
		const pairDayResponse = await fetch(this.graphUrl, {
			method: 'POST',
			body: JSON.stringify({ query }),
		})
			.then((response) => response.json())
			.then((pairInfo) => pairInfo.data.pairDayDatas);

		let totalApy = 0;
		const performance: Performance = uniformPerformance(0);
		for (let i = 0; i < pairDayResponse.length; i++) {
			const volume = parseFloat(pairDayResponse[i].dailyVolumeUSD);
			const poolReserve = parseFloat(pairDayResponse[i].reserveUSD);
			const fees = volume * 0.003;
			totalApy += (fees / poolReserve) * 365 * 100;
			const currentApy = totalApy / (i + 1);
			if (i === 0) performance.oneDay = currentApy;
			if (i === 2) performance.threeDay = currentApy;
			if (i === 6) performance.sevenDay = currentApy;
			if (i === 29) performance.thirtyDay = currentApy;
		}
		return performance;
	}
}
