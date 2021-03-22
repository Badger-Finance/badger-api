import { Inject, Service } from '@tsed/common';
import fetch from 'node-fetch';
import { Chain } from '../chains/config/chain.config';
import { CURVE_API_URL, Protocol } from '../config/constants';
import { SettDefinition } from '../interface/Sett';
import { ValueSource } from './interfaces/value-source.interface';
import { PancakeSwapService } from './pancake/PancakeSwapService';
import { SushiswapService } from './sushi/SushiswapService';
import { UniswapService } from './uni/UniswapService';

/**
 * External protocol performance retrieval service.
 */
@Service()
export class ProtocolsService {
  @Inject()
  uniswapService!: UniswapService;
  @Inject()
  sushiswapService!: SushiswapService;
  @Inject()
  pancakeSwapService!: PancakeSwapService;

  /**
   * Retrieve performance of underlying protocol for a given sett.
   * @param sett Sett to retrieve protocol performance.
   */
  async getProtocolPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    if (!sett.protocol) return [];

    switch (sett.protocol) {
      case Protocol.Curve:
        return this.getCurvePerformance(sett);
      case Protocol.Uniswap:
        return this.uniswapService.getPairPerformance(chain, sett);
      case Protocol.Sushiswap:
        return this.sushiswapService.getPairPerformance(chain, sett);
      case Protocol.Pancakeswap:
        return this.pancakeSwapService.getPairPerformance(chain, sett);
      default:
        return [];
    }
  }

  /**
   * Retrieve Curve DAO pool performance from trading fees.
   * @param sett Sett to retrieve curve performance for.
   */
  private async getCurvePerformance(sett: SettDefinition): Promise<ValueSource[]> {
    const assetMap: { [asset: string]: string } = {
      hrenbtccrv: 'ren2',
      renbtccrv: 'ren2',
      sbtccrv: 'rens',
      tbtccrv: 'tbtc',
    };

    const curveData = await fetch(CURVE_API_URL).then((response) => response.json());
    const tradeFeePerformance = {
      oneDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      threeDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      sevenDay: curveData.apy.week[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      thirtyDay: curveData.apy.month[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
    };
    return [
      {
        name: 'Curve LP Fees',
        apy: tradeFeePerformance.threeDay,
        performance: tradeFeePerformance,
      },
    ];
  }
}
