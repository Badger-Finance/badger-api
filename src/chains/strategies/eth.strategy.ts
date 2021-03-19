import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { TOKENS } from '../../config/constants';
import { getContractPrice, getTokenPrice, getVaultTokenPrice } from '../../prices/prices-util';
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
        TOKENS.BBADGER,
        TOKENS.BDIGG,
        TOKENS.BUNI_DIGG_WBTC,
        TOKENS.BUNI_BADGER_WBTC,
        TOKENS.BSUSHI_ETH_WBTC,
        TOKENS.BSUSHI_BADGER_WBTC,
        TOKENS.BSUSHI_DIGG_WBTC,
        TOKENS.BCRV_RENBTC,
        TOKENS.BCRV_SBTC,
        TOKENS.BCRV_TBTC,
        TOKENS.BCRV_HRENBTC,
      ],
      this,
    );
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const checksummedAddress = ethers.utils.getAddress(address);
    const attributes = ethTokensConfig[checksummedAddress];
    if (!attributes) {
      throw new BadRequest(`No attributes found for ${checksummedAddress}`);
    }
    switch (attributes.type) {
      case TokenType.Contract:
        if (attributes.lookupName) {
          return getTokenPrice(attributes.lookupName);
        }
        return getContractPrice(checksummedAddress);
      case TokenType.SushiswapLp:
        return getSushiswapPrice(checksummedAddress);
      case TokenType.UniswapLp:
        return getUniswapPrice(checksummedAddress);
      case TokenType.Vault:
        return getVaultTokenPrice(checksummedAddress);
      default:
        throw new UnprocessableEntity('Unsupported TokenType');
    }
  }
}
