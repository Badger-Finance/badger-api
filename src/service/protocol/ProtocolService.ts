import { Service } from '@tsed/common';
import fetch from 'node-fetch';
import { Performance } from '../../interface/Performance';
import { ValueSource } from '../../interface/ValueSource';
import { CURVE_API_URL, SUSHISWAP_URL, UNISWAP_URL } from '../../util/constants';
import { SettData } from '../setts';

/**
 * External protocol performance retrieval service.
 */
@Service()
export class ProtocolService {
	/**
	 * Retrieve performance of underlying protocol for a given sett.
	 * @param sett Sett to retrieve protocol performance.
	 */
	async getProtocolPerformance(sett: SettData): Promise<ValueSource> {
		let protocolPerformance: Performance;

		switch (sett.protocol) {
			case 'curve':
				protocolPerformance = await this.getCurvePerformance(sett);
				break;
			case 'uniswap':
				protocolPerformance = await this.getSwapPerformance(sett.depositToken, sett.protocol);
				break;
			case 'sushiswap':
				// TODO: Add MasterChef / xSushi APY
				protocolPerformance = await this.getSwapPerformance(sett.depositToken, sett.protocol);
				break;
			default:
				protocolPerformance = {
					oneDay: 0,
					threeDay: 0,
					sevenDay: 0,
					thirtyDay: 0,
				};
		}

		return {
			name: sett.protocol,
			apy: protocolPerformance.threeDay,
			performance: protocolPerformance,
		} as ValueSource;
	}

	/**
	 * Retrieve Curve DAO pool performance from trading fees.
	 * This does not calculate the CRV (or third party) token emissions as
	 * the performance from these are tracked inherently via pricePerFullShare
	 * differential.
	 * @param sett Sett to retrieve curve performance for.
	 */
	private async getCurvePerformance(sett: SettData): Promise<Performance> {
		const assetMap = {
			hrenbtccrv: 'ren2',
			renbtccrv: 'ren2',
			sbtccrv: 'rens',
			tbtccrv: 'tbtc',
		} as Record<string, string>;

		const curveData = await fetch(CURVE_API_URL).then((response) => response.json());
		return {
			oneDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
			threeDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
			sevenDay: curveData.apy.week[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
			thirtyDay: curveData.apy.month[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
		} as Performance;
	}

	/**
	 * Retrieve Uniswap v2 variant pool performance from trading fees.
	 * @param poolAddress Liquidity pair contract address.
	 * @param protocol Uniswap v2 variant type.
	 */
	async getSwapPerformance(poolAddress: string, protocol: string): Promise<Performance> {
		// TODO: Move query to GraphService
		const query = `
      {
        pairDayDatas(first: 30, orderBy: date, orderDirection: desc, where:{pairAddress: "${poolAddress}"}) {
          reserveUSD
          dailyVolumeUSD
        }
      }
    `;
		const pairDayResponse = await fetch(protocol === 'uniswap' ? UNISWAP_URL : SUSHISWAP_URL, {
			method: 'POST',
			body: JSON.stringify({ query }),
		})
			.then((response) => response.json())
			.then((pairInfo) => pairInfo.data.pairDayDatas);

		const performance: Performance = {
			oneDay: 0,
			threeDay: 0,
			sevenDay: 0,
			thirtyDay: 0,
		};
		let totalApy = 0;
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
