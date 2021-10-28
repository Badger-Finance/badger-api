import { Network } from '@badger-dao/sdk';
import { getUniswapPrice } from '../../protocols/common/swap.utils';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { BaseStrategy } from './base.strategy';

export class EthStrategy extends BaseStrategy {
  constructor(tokens: string[]) {
    super(Network.Ethereum, tokens);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const token = this.getToken(address);
    switch (token.type) {
      case TokenType.UniswapLp:
        return getUniswapPrice(token.address);
      default:
        return super.getPrice(address);
    }
  }
}
