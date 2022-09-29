import { Network } from '@badger-dao/sdk';

import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const arbitrumTokensConfig: TokenConfig = {
  [TOKENS.ARB_USDT]: {
    lookupName: 'tether',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_IBBTC]: {
    lookupName: 'interest-bearing-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_BADGER]: {
    lookupName: 'badger-dao',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_CRV]: {
    lookupName: 'curve-dao-token',
    type: PricingType.LookupName,
  },
  [TOKENS.MULTI_RENBTC]: {
    lookupName: 'renbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_WETH]: {
    lookupName: 'ethereum',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_WBTC]: {
    lookupName: 'bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_SUSHI]: {
    lookupName: 'sushi',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_SWAPR]: {
    lookupName: 'swapr',
    type: PricingType.LookupName,
  },
  [TOKENS.ARB_SUSHI_WETH_SUSHI]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.ARB_SUSHI_WETH_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.ARB_CRV_RENBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.ARB_CRV_TRICRYPTO]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.ARB_SWP_SWPR_WETH]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.ARB_SWP_WBTC_WETH]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.ARB_SWP_BADGER_WETH]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.ARB_SWP_IBBTC_WETH]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.BARB_SUSHI_WETH_SUSHI]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SUSHI_WETH_SUSHI,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SUSHI_WETH_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SUSHI_WETH_WBTC,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_CRV_RENBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_RENBTC,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_CRV_TRICRYPTO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_TRICRYPTO,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_CRV_TRICRYPTO_LITE]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_TRICRYPTO,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_SWPR_WETH]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_SWPR_WETH,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_WBTC_WETH]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_WBTC_WETH,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_BADGER_WETH]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_BADGER_WETH,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_IBBTC_WETH]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_IBBTC_WETH,
      network: Network.Arbitrum,
    },
  },
};
