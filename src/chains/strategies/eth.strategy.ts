import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { TOKENS } from '../../config/constants';
import { getContractPrice, getTokenPrice } from '../../prices/prices-util';
import { getSushiswapPrice, getUniswapPrice } from '../../protocols/common/swap-util';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { ChainStrategy } from './chain.strategy';

export class EthStrategy extends ChainStrategy {
  constructor() {
    super();
    ChainStrategy.register(
      [
        TOKENS.BADGER,
        TOKENS.DIGG,
        TOKENS.SUSHI,
        TOKENS.WBTC,
        TOKENS.WETH,
        TOKENS.CRV_RENBTC,
        TOKENS.CRV_TBTC,
        TOKENS.CRV_SBTC,
        TOKENS.SUSHI_ETH_WBTC,
        TOKENS.SUSHI_BADGER_WBTC,
        TOKENS.SUSHI_DIGG_WBTC,
        TOKENS.UNI_BADGER_WBTC,
        TOKENS.UNI_DIGG_WBTC,
      ],
      this,
    );
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const attributes = ethTokensConfig[address];
    if (!attributes) {
      throw new BadRequest(`No attributes found for ${address}`);
    }
    switch (attributes.type) {
      case TokenType.Contract:
        if (attributes.lookupName) return getTokenPrice(attributes.lookupName);
        return getContractPrice(address);
      case TokenType.SushiswapLp:
        return getSushiswapPrice(address);
      case TokenType.UniswapLp:
        return getUniswapPrice(address);
      default:
        throw new UnprocessableEntity('Unsupported TokenType');
    }
  }
}
