import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getContractPrice, getTokenPrice, getVaultTokenPrice } from '../../prices/prices.utils';
import { getOnChainLiquidityPrice, getUniswapPrice, resolveTokenPrice } from '../../protocols/common/swap.utils';
import { getCurveTokenPrice } from '../../protocols/strategies/convex.strategy';
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
    const eth = Chain.getChain(ChainNetwork.Ethereum);
    switch (token.type) {
      case TokenType.Custom:
        if (!token.getPrice) {
          throw new UnprocessableEntity(`${token.name} requires custom price implementation`);
        }
        return token.getPrice(eth, token);
      case TokenType.Contract:
        if (token.lookupName) {
          return this.resolveLookupName(token.lookupName, token.address);
        }
        return getContractPrice(checksummedAddress);
      case TokenType.CurveLP:
        return getCurveTokenPrice(eth, checksummedAddress);
      case TokenType.SushiswapLp:
        return getOnChainLiquidityPrice(Chain.getChain(ChainNetwork.Ethereum), checksummedAddress);
      case TokenType.UniswapLp:
        return getUniswapPrice(checksummedAddress);
      case TokenType.Vault:
        return getVaultTokenPrice(checksummedAddress);
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
