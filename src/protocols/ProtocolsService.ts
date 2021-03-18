import { Inject, Service } from '@tsed/common';
import fetch from 'node-fetch';
import { Chain } from '../chains/config/chain.config';
import { CURVE_API_URL, Protocol } from '../config/constants';
import { Performance } from '../interface/Performance';
import { SettDefinition } from '../interface/Sett';
import { ValueSource } from '../interface/ValueSource';
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
  async getProtocolPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource | undefined> {
    if (!sett.protocol) return undefined;
    let protocolPerformance: Performance;

    switch (sett.protocol) {
      case Protocol.Curve:
        protocolPerformance = await this.getCurvePerformance(sett);
        break;
      case Protocol.Uniswap:
        protocolPerformance = await this.uniswapService.getPairPerformance(chain, sett);
        break;
      case Protocol.Sushiswap:
        protocolPerformance = await this.sushiswapService.getPairPerformance(chain, sett);
        break;
      case Protocol.Pancakeswap:
        protocolPerformance = await this.pancakeSwapService.getPairPerformance(chain, sett);
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
