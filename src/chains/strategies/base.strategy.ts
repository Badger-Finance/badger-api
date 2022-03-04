import { UnprocessableEntity } from '@tsed/exceptions';
import { getOnChainLiquidityPrice, resolveTokenPrice } from '../../protocols/common/swap.utils';
import { getCurveTokenPrice } from '../../protocols/strategies/convex.strategy';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { Chain } from '../config/chain.config';
import { ChainStrategy } from './chain.strategy';
import { Network } from '@badger-dao/sdk';
import { getVaultTokenPrice } from '../../vaults/vaults.utils';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { getToken } from '../../tokens/tokens.utils';

export class BaseStrategy extends ChainStrategy {
  constructor(private network: Network, tokens: string[]) {
    super();
    ChainStrategy.register(this, tokens);
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const chain = Chain.getChain(this.network);
    const token = getToken(address);
    switch (token.type) {
      case PricingType.Custom:
        if (!token.getPrice) {
          throw new UnprocessableEntity(`${token.name} requires custom price implementation`);
        }
        return token.getPrice(chain, token);
      case PricingType.OnChainUniV2LP:
        if (!token.lookupName) {
          throw new UnprocessableEntity(`${token.name} required lookupName to utilize OnChainUniV2LP pricing`);
        }
        return resolveTokenPrice(chain, token.address, token.lookupName);
      case PricingType.CurveLP:
        return getCurveTokenPrice(chain, token.address);
      case PricingType.UniV2LP:
        return getOnChainLiquidityPrice(chain, token.address);
      case PricingType.Vault:
        return getVaultTokenPrice(chain, token.address);
      case PricingType.Contract:
      case PricingType.LookupName:
        throw new UnprocessableEntity('CoinGecko pricing should utilize fetchPrices via utilities');
      default:
        throw new UnprocessableEntity('Unsupported PricingType');
    }
  }
}
