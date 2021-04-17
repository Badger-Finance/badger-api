import { Chain } from '../../chains/config/chain.config';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { ValueSource } from '../interfaces/value-source.interface';
import { getSwapValueSource } from './performance.utils';
import { getLiquidityPrice } from './swap.utils';

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
    return getSwapValueSource(this.graphUrl, this.name, poolAddress);
  }

  async getPairPrice(contract: string): Promise<TokenPrice> {
    return getLiquidityPrice(this.graphUrl, contract);
  }
}
