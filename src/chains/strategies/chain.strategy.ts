import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';

import { TokenPrice } from '../../prices/interface/token-price.interface';
import { getFullToken } from '../../tokens/tokens.utils';
import { Chain } from '../config/chain.config';

type Strategies = Record<string, ChainStrategy>;

export abstract class ChainStrategy {
  private static strategies: Strategies = {};

  static register(strategy: ChainStrategy, addresses: string[]): void {
    for (const address of addresses) {
      ChainStrategy.strategies[ethers.utils.getAddress(address)] = strategy;
    }
  }

  static async getStrategy(chain: Chain, address: string): Promise<ChainStrategy> {
    const token = await getFullToken(chain, address);

    const strategy = this.strategies[token.address];
    if (!strategy) {
      throw new BadRequest(`Token (${token.address}) not supported for pricing`);
    }
    return strategy;
  }

  abstract getPrice(address: string): Promise<TokenPrice>;
}
