import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const xDaiTokensConfig: TokenConfig = {
  [TOKENS.XDAI_WBTC]: {
    lookupName: 'wrapped-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.XDAI_WETH]: {
    lookupName: 'ethereum',
    type: PricingType.LookupName,
  },
  [TOKENS.XDAI_SUSHI_WBTC_WETH]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.BXDAI_SUSHI_WBTC_WETH]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.XDAI_SUSHI_WBTC_WETH,
      network: Network.xDai,
    },
  },
};
