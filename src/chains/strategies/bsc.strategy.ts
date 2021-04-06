import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getTokenPrice, getVaultTokenPrice, getWrapperTokenPrice } from '../../prices/prices-util';
import { getPancakeswapPrice } from '../../protocols/common/swap-util';
import { bscTokensConfig } from '../../tokens/config/bsc-tokens.config';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { ChainStrategy } from './chain.strategy';

export class BscStrategy extends ChainStrategy {
  constructor() {
    super();
    ChainStrategy.register(Object.keys(bscTokensConfig), this);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const checksummedAddress = ethers.utils.getAddress(address);
    const attributes = bscTokensConfig[checksummedAddress];
    if (!attributes) {
      throw new BadRequest(`No attributes found for ${checksummedAddress}`);
    }
    switch (attributes.type) {
      case TokenType.Contract:
        if (!attributes.lookupName) {
          throw new UnprocessableEntity(`No lookup name available for ${checksummedAddress}`);
        }
        return getTokenPrice(attributes.lookupName);
      case TokenType.PancakeswapLp:
        return getPancakeswapPrice(checksummedAddress);
      case TokenType.Vault:
        return getVaultTokenPrice(checksummedAddress);
      case TokenType.Wrapper:
        return getWrapperTokenPrice(checksummedAddress);
      default:
        throw new UnprocessableEntity('Unsupported TokenType');
    }
  }
}
