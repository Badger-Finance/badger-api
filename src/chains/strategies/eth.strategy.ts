import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getContractPrice, getTokenPrice, getVaultTokenPrice, ibBTCPrice } from '../../prices/prices.utils';
import { getSushiswapPrice, getUniswapPrice, resolveTokenPrice } from '../../protocols/common/swap.utils';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { Chain } from '../config/chain.config';
import { ChainNetwork } from '../enums/chain-network.enum';
import { ChainStrategy } from './chain.strategy';

export class EthStrategy extends ChainStrategy {
  constructor() {
    super();
    ChainStrategy.register(Object.keys(ethTokensConfig), this);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const checksummedAddress = ethers.utils.getAddress(address);
    const token = ethTokensConfig[checksummedAddress];
    if (!token) {
      throw new BadRequest(`No token found for ${checksummedAddress}`);
    }
    switch (token.type) {
      case TokenType.Contract:
        if (token.lookupName) {
          return this.resolveLookupName(token.lookupName, token.address);
        }
        return getContractPrice(checksummedAddress);
      case TokenType.SushiswapLp:
        return getSushiswapPrice(checksummedAddress);
      case TokenType.UniswapLp:
        return getUniswapPrice(checksummedAddress);
      case TokenType.Vault:
        return getVaultTokenPrice(checksummedAddress);
      case TokenType.Index:
        return ibBTCPrice();
      default:
        throw new UnprocessableEntity('Unsupported TokenType');
    }
  }

  async resolveLookupName(lookupName: string, token: string): Promise<TokenPrice> {
    const isContract = ethers.utils.isAddress(lookupName);
    if (isContract) {
      return resolveTokenPrice(Chain.getChain(ChainNetwork.Ethereum), token, lookupName);
    }
    return getTokenPrice(lookupName);
  }
}
