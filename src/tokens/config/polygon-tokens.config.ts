import { Network } from '@badger-dao/sdk';

import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const maticTokensConfig: TokenConfig = {
  [TOKENS.MATIC_WMATIC]: {
    lookupName: 'matic-network',
    type: PricingType.LookupName,
  },
  [TOKENS.MULTI_RENBTC]: {
    lookupName: 'renbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_WBTC]: {
    lookupName: 'wrapped-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_USDC]: {
    lookupName: 'usd-coin',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_USDT]: {
    lookupName: 'tether',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_DAI]: {
    lookupName: 'dai',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_IBBTC]: {
    lookupName: 'interest-bearing-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_AMWBTC]: {
    lookupName: 'aave-polygon-wbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_AMWETH]: {
    lookupName: 'aave-polygon-weth',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_AMDAI]: {
    lookupName: 'aave-polygon-dai',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_AMUSDC]: {
    lookupName: 'aave-polygon-usdc',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_AMUSDT]: {
    lookupName: 'aave-polygon-usdt',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_CRV]: {
    lookupName: 'curve-dao-token',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_BADGER]: {
    lookupName: 'badger-dao',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_SUSHI]: {
    lookupName: 'sushi',
    type: PricingType.LookupName,
  },
  [TOKENS.MATIC_SUSHI_IBBTC_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.MATIC_QUICK_USDC_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.MATIC_CRV_AM3CRV]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.MATIC_CRV_AMWBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.BMATIC_SUSHI_IBBTC_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.MATIC_SUSHI_IBBTC_WBTC,
      network: Network.Polygon,
    },
  },
  [TOKENS.BMATIC_QUICK_USDC_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.MATIC_QUICK_USDC_WBTC,
      network: Network.Polygon,
    },
  },
  [TOKENS.BMATIC_CRV_AMWBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.MATIC_CRV_AMWBTC,
      network: Network.Polygon,
    },
  },
};
