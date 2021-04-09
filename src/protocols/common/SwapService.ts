import fetch from 'node-fetch';
import { Chain } from '../../chains/config/chain.config';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { Performance, uniformPerformance } from '../interfaces/performance.interface';
import { ValueSource } from '../interfaces/value-source.interface';
import { getLiquidityPrice } from './swap-util';

export abstract class SwapService {
  constructor(private graphUrl: string, private name: string) {}

  abstract getPairPerformance(
    chain: Chain,
    sett: SettDefinition,
    filterHarvestablePerformances?: boolean,
  ): Promise<ValueSource[]>;

  /**
   * Retrieve Uniswap v2 variant pool performance from trading fees.
   * @param poolAddress Liquidity pair contract address.
   * @param protocol Uniswap v2 variant type.
   */
  async getSwapPerformance(poolAddress: string): Promise<ValueSource> {
    // TODO: Move query to GraphService
    const query = `
      {
        pairDayDatas(first: 30, orderBy: date, orderDirection: desc, where:{pairAddress: "${poolAddress.toLowerCase()}"}) {
          reserveUSD
          dailyVolumeUSD
        }
      }
    `;
    const response = await fetch(this.graphUrl, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    const unknownPerformance = uniformPerformance(0);
    const uknownValuSource = {
      name: `${this.name} LP Fees`,
      apy: unknownPerformance.threeDay,
      performance: unknownPerformance,
    };

    if (!response.ok) {
      return uknownValuSource;
    }

    const pairDayResponse = await response.json();
    if (pairDayResponse.errors) {
      return uknownValuSource;
    }
    const pairDayData = pairDayResponse.data.pairDayDatas;

    let totalApy = 0;
    const performance: Performance = uniformPerformance(0);
    for (let i = 0; i < pairDayData.length; i++) {
      const volume = parseFloat(pairDayData[i].dailyVolumeUSD);
      const poolReserve = parseFloat(pairDayData[i].reserveUSD);
      const fees = volume * 0.003;
      totalApy += (fees / poolReserve) * 365 * 100;
      const currentApy = totalApy / (i + 1);
      if (i === 0) performance.oneDay = currentApy;
      if (i === 2) performance.threeDay = currentApy;
      if (i === 6) performance.sevenDay = currentApy;
      if (i === 29) performance.thirtyDay = currentApy;
    }
    return {
      name: `${this.name} LP Fees`,
      apy: performance.threeDay,
      performance: performance,
    };
  }

  async getPairPrice(contract: string): Promise<TokenPrice> {
    return getLiquidityPrice(this.graphUrl, contract);
  }
}
