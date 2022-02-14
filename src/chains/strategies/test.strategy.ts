import { TokenPrice } from '../../prices/interface/token-price.interface';
import { protocolTokens } from '../../tokens/tokens.utils';
import { ChainStrategy } from './chain.strategy';

export class TestStrategy extends ChainStrategy {
  constructor() {
    super();
    ChainStrategy.register(Object.keys(protocolTokens), this);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const price = parseInt(address.slice(0, 6), 16);
    return { address, price };
  }

  randomPrice(min?: number, max?: number): number {
    const minPrice = min || 10;
    const maxPrice = max || 50000;
    return minPrice + Math.random() * (maxPrice - minPrice);
  }
}
