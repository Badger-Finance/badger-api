import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getContractPrice, getTokenPrice, getVaultTokenPrice, getWrapperTokenPrice } from '../../prices/prices.utils';
import { getOnChainLiquidityPrice, resolveTokenPrice } from '../../protocols/common/swap.utils';
import { getCurveTokenPrice } from '../../protocols/strategies/convex.strategy';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { Token } from '../../tokens/interfaces/token.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { Chain } from '../config/chain.config';
import { ChainNetwork } from '../enums/chain-network.enum';
import { ChainStrategy } from './chain.strategy';

export class BaseStrategy extends ChainStrategy {
  private network: ChainNetwork;

  constructor(network: ChainNetwork, tokens: string[]) {
    super();
    this.network = network;
    ChainStrategy.register(tokens, this);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const chain = Chain.getChain(this.network);
    const token = this.getToken(address);
    switch (token.type) {
      case TokenType.Custom:
        if (!token.getPrice) {
          throw new UnprocessableEntity(`${token.name} requires custom price implementation`);
        }
        return token.getPrice(chain, token);
      case TokenType.Contract:
        if (token.lookupName) {
          return this.resolveLookupName(token.lookupName, token.address);
        }
        return getContractPrice(token.address);
      case TokenType.CurveLP:
        return getCurveTokenPrice(chain, token.address);
      case TokenType.SushiswapLp:
        return getOnChainLiquidityPrice(chain, token.address);
      case TokenType.Vault:
        return getVaultTokenPrice(token.address);
      case TokenType.Wrapper:
        return getWrapperTokenPrice(token.address);
      default:
        throw new UnprocessableEntity('Unsupported TokenType');
    }
  }

  getToken(address: string): Token {
    const chain = Chain.getChain(this.network);
    const checksummedAddress = ethers.utils.getAddress(address);
    const token = chain.tokens[checksummedAddress];
    if (!token) {
      throw new BadRequest(`No token found for ${checksummedAddress}`);
    }
    return token;
  }

  private async resolveLookupName(lookupName: string, token: string): Promise<TokenPrice> {
    const chain = Chain.getChain(this.network);
    const isContract = ethers.utils.isAddress(lookupName);
    if (isContract) {
      return resolveTokenPrice(chain, token, lookupName);
    }
    return getTokenPrice(lookupName);
  }
}
