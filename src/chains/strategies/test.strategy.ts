import { ethers } from 'ethers';
import { PriceData, TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { getToken, protocolTokens } from '../../tokens/tokens.utils';
import { ChainStrategy } from './chain.strategy';

export class TestStrategy extends ChainStrategy {
  private priceData: PriceData = {};

  constructor() {
    super();
    ChainStrategy.register(Object.keys(protocolTokens), this);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const checksummedAddress = ethers.utils.getAddress(address);
    const price = this.priceData[checksummedAddress];
    if (!price) {
      const token = getToken(checksummedAddress);
      const ethPrice = this.randomPrice(1500, 3000);
      const usdPrice = this.randomPrice();
      const tokenPrice = {
        name: token.name,
        address: token.address,
        usd: usdPrice,
        eth: usdPrice / ethPrice,
      };
      this.priceData[checksummedAddress] = tokenPrice;
      return tokenPrice;
    }
    return price;
  }

  randomPrice(min?: number, max?: number): number {
    const minPrice = min || 10;
    const maxPrice = max || 50000;
    return minPrice + Math.random() * (maxPrice - minPrice);
  }
}
