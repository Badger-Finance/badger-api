import { getQuickswapPrice } from '../../protocols/common/swap.utils';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { ChainNetwork } from '../enums/chain-network.enum';
import { BaseStrategy } from './base.strategy';

export class MaticStrategy extends BaseStrategy {
  constructor(tokens: string[]) {
    super(ChainNetwork.Matic, tokens);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const token = this.getToken(address);
    switch (token.type) {
      case TokenType.QuickswapLp:
        return getQuickswapPrice(token.address);
      default:
        return super.getPrice(address);
    }
  }
}
