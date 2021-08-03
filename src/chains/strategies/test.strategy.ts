import { ethers } from 'ethers';
import { PriceData } from '../../tokens/interfaces/price-data.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
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
      const usdPrice = parseInt(address.slice(0, 6), 16);
      const ethPrice = 2400;
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
