import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';

type Strategies = Record<string, ChainStrategy>;

export abstract class ChainStrategy {
  private static strategies: Strategies = {} as Strategies;

  static register(addresses: string[], strategy: ChainStrategy): void {
    for (const address of addresses) {
      ChainStrategy.strategies[ethers.utils.getAddress(address)] = strategy;
    }
  }

  static getStrategy(address: string): ChainStrategy {
    const strategy = this.strategies[ethers.utils.getAddress(address)];
    if (!strategy) {
      throw new BadRequest('Token not supported for pricing');
    }
    return strategy;
  }

  abstract getPrice(address: string): Promise<TokenPrice>;
}
