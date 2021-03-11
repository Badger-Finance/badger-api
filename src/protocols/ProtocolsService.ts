import { Inject, Service } from '@tsed/common';
import fetch from 'node-fetch';
import { eth } from '../config/chain/chain';
import { CURVE_API_URL, Protocol } from '../config/constants';
import { Performance } from '../interface/Performance';
import { SettDefinition } from '../interface/Sett';
import { ValueSource } from '../interface/ValueSource';
import { PriceService } from '../prices/PricesService';
import { SushiswapService } from './sushi/SushiswapService';
import { UniswapService } from './uni/UniswapService';

/**
 * External protocol performance retrieval service.
 */
@Service()
export class ProtocolService {
	@Inject()
	priceService!: PriceService;
	@Inject()
	uniswapService!: UniswapService;
	@Inject()
	sushiswapService!: SushiswapService;

	/**
	 * Retrieve performance of underlying protocol for a given sett.
	 * @param sett Sett to retrieve protocol performance.
	 */
	async getProtocolPerformance(sett: SettDefinition): Promise<ValueSource | undefined> {
		if (!sett.protocol) return undefined;
		let protocolPerformance: Performance;

		switch (sett.protocol) {
			case Protocol.Curve:
				protocolPerformance = await this.getCurvePerformance(sett);
				break;
			case Protocol.Uniswap:
				protocolPerformance = await this.uniswapService.getPairPerformance(eth, sett);
				break;
			case Protocol.Sushiswap:
				protocolPerformance = await this.sushiswapService.getPairPerformance(eth, sett);
				break;
			case Protocol.Pancakeswap:
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
	private async getCurvePerformance(sett: SettDefinition): Promise<Performance> {
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
}
