import { getPancakeswapPrice } from '../../protocols/common/swap.utils';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { ChainNetwork } from '../enums/chain-network.enum';
import { BaseStrategy } from './base.strategy';

export class BscStrategy extends BaseStrategy {
  constructor(tokens: string[]) {
    super(ChainNetwork.BinanceSmartChain, tokens);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const token = this.getToken(address);
    switch (token.type) {
      case TokenType.PancakeswapLp:
        return getPancakeswapPrice(token.address);
      default:
        return super.getPrice(address);
    }
  }
}
