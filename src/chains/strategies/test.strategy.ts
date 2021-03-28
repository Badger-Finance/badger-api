import { ethers } from 'ethers';
import { PriceData, TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { getToken, protocolTokens } from '../../tokens/tokens-util';
import { ChainStrategy } from './chain.strategy';

export class TestStrategy extends ChainStrategy {
  private priceData: PriceData;

  constructor(priceData: PriceData) {
    super();
    this.priceData = priceData;
    ChainStrategy.register(Object.keys(protocolTokens), this);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const checksummedAddress = ethers.utils.getAddress(address);
    const price = this.priceData[checksummedAddress];
    if (!price) {
      const token = getToken(checksummedAddress);
      return {
        name: token.name,
        address: token.address,
        usd: 0,
        eth: 0,
      };
    }
    return price;
  }
}
