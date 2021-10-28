import { Network } from '@badger-dao/sdk';
import { getArbitriumLiquidityPrice } from '../../protocols/common/swap.utils';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { BaseStrategy } from './base.strategy';

export class ArbitrumStrategy extends BaseStrategy {
  constructor(tokens: string[]) {
    super(Network.Arbitrum, tokens);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const token = this.getToken(address);
    switch (token.type) {
      case TokenType.SwaprLp:
        return getArbitriumLiquidityPrice(token.address);
      default:
        return super.getPrice(address);
    }
  }
}
