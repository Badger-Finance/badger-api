import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { TOKENS } from '../../config/constants';
import { getTokenPrice } from '../../prices/prices-util';
import { getPancakeswapPrice } from '../../protocols/common/swap-util';
import { bscTokensConfig } from '../../tokens/config/bsc-tokens.config';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { ChainStrategy } from './chain.strategy';

export class BscStrategy extends ChainStrategy {
  constructor() {
    super();
    ChainStrategy.register(
      [
        TOKENS.CAKE,
        TOKENS.BTCB,
        TOKENS.WBNB,
        TOKENS.PANCAKE_BDIGG_BTCB,
        TOKENS.PANCAKE_BNB_BTCB,
        TOKENS.PANCAKE_BBADGER_BTCB,
      ],
      this,
    );
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const attributes = bscTokensConfig[address];
    if (!attributes) {
      throw new BadRequest(`No attributes found for ${address}`);
    }
    switch (attributes.type) {
      case TokenType.Contract:
        if (!attributes.lookupName) throw new UnprocessableEntity(`No lookup name availabe for ${address}`);
        return getTokenPrice(attributes.lookupName);
      case TokenType.PancakeswapLp:
        return getPancakeswapPrice(address);
      default:
        throw new UnprocessableEntity('Unsupported TokenType');
    }
  }
}
