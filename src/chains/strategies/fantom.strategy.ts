import { Network } from '@badger-dao/sdk';
import { getFantomLiquidityPrice } from '../../protocols/common/swap.utils';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { BaseStrategy } from './base.strategy';

export class FantomStrategy extends BaseStrategy {
  constructor(tokens: string[]) {
    super(Network.Fantom, tokens);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const token = this.getToken(address);
    switch (token.type) {
      case TokenType.SolidlyLp:
        return getFantomLiquidityPrice(token.address);
      default:
        return super.getPrice(address);
    }
  }
}
