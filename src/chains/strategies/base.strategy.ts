import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getOnChainLiquidityPrice } from '../../protocols/common/swap.utils';
import { getCurveTokenPrice } from '../../protocols/strategies/convex.strategy';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { Token } from '../../tokens/interfaces/token.interface';
import { Chain } from '../config/chain.config';
import { ChainStrategy } from './chain.strategy';
import { Network } from '@badger-dao/sdk';
import { getVaultTokenPrice } from '../../vaults/vaults.utils';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { getContractPrice } from '../../prices/coingecko.utils';

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
      case PricingType.Custom:
        if (!token.getPrice) {
          throw new UnprocessableEntity(`${token.name} requires custom price implementation`);
        }
        return token.getPrice(chain, token);
      case PricingType.Contract:
        return getContractPrice(token.address);
      case PricingType.CurveLP:
        return getCurveTokenPrice(chain, token.address);
      case PricingType.UniV2LP:
        return getOnChainLiquidityPrice(chain, token.address);
      case PricingType.Vault:
        return getVaultTokenPrice(token.address);
      default:
        throw new UnprocessableEntity('Unsupported PricingType');
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
}
