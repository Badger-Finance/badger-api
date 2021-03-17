import { TokenPrice } from '../../tokens/interfaces/token-price.interface';

type Strategies = Record<string, ChainStrategy>;

export abstract class ChainStrategy {
  private static strategies: Strategies = {} as Strategies;

  static register(addresses: string[], strategy: ChainStrategy): void {
    for (const address of addresses) {
      ChainStrategy.strategies[address] = strategy;
    }
  }

  static getStrategy(address: string): ChainStrategy {
    return this.strategies[address];
  }

  abstract getPrice(address: string): Promise<TokenPrice>;
}
