import { Network } from '@badger-dao/sdk';
import { UnprocessableEntity } from '@tsed/exceptions';

import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { getBPTPrice } from '../../protocols/strategies/balancer.strategy';
import { getCurveTokenPrice } from '../../protocols/strategies/convex.strategy';
import { getOnChainLiquidityPrice, resolveTokenPrice } from '../../protocols/strategies/uniswap.strategy';
import { getFullToken } from '../../tokens/tokens.utils';
import { getVaultTokenPrice } from '../../vaults/vaults.utils';
import { getOrCreateChain } from '../chains.utils';
import { ChainStrategy } from './chain.strategy';

export class BaseStrategy extends ChainStrategy {
  constructor(private network: Network) {
    super();
  }

  async getPrice(address: string): Promise<TokenPrice> {
    const chain = getOrCreateChain(this.network);
    const token = await getFullToken(chain, address);
    const tokenConfig = chain.tokens[address];

    switch (token.type) {
      case PricingType.Custom:
        if (!token.getPrice) {
          throw new UnprocessableEntity(`${token.name} requires custom price implementation`);
        }
        return token.getPrice(chain, token, tokenConfig.lookupName);
      case PricingType.OnChainUniV2LP:
        if (!token.lookupName) {
          throw new UnprocessableEntity(`${token.name} required lookupName to utilize OnChainUniV2LP pricing`);
        }
        return resolveTokenPrice(chain, token.address, token.lookupName);
      case PricingType.BalancerLP:
        return getBPTPrice(chain, token.address);
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
