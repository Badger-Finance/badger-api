import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getContractPrice, getTokenPrice, getVaultTokenPrice } from '../../prices/prices.utils';
import { getSushiswapPrice, getUniswapPrice } from '../../protocols/common/swap.utils';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { ChainStrategy } from './chain.strategy';

export class EthStrategy extends ChainStrategy {
  constructor() {
    super();
    ChainStrategy.register(Object.keys(ethTokensConfig), this);
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
