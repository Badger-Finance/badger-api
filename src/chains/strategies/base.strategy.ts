import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getContractPrice, getTokenPrice } from '../../prices/prices.utils';
import { getOnChainLiquidityPrice, resolveTokenPrice } from '../../protocols/common/swap.utils';
import { getCurveTokenPrice } from '../../protocols/strategies/convex.strategy';
import { TokenType } from '../../tokens/enums/token-type.enum';
import { Token } from '../../tokens/interfaces/token.interface';
import { Chain } from '../config/chain.config';
import { ChainStrategy } from './chain.strategy';
import { Network } from '@badger-dao/sdk';
import { getVaultTokenPrice } from '../../vaults/vaults.utils';
import { TokenPrice } from '../../prices/interface/token-price.interface';

export class BaseStrategy extends ChainStrategy {
  constructor(private network: Network, tokens: string[]) {
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
      case TokenType.QuickswapLp:
      case TokenType.SwaprLp:
      case TokenType.PancakeswapLp:
      case TokenType.SolidlyLp:
      case TokenType.UniswapLp:
        return getOnChainLiquidityPrice(chain, token.address);
      case TokenType.Vault:
        return getVaultTokenPrice(token.address);
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
