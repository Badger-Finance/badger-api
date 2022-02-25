import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const fantomTokensConfig: TokenConfig = {
  [TOKENS.MULTI_BADGER]: {
    address: TOKENS.MULTI_BADGER,
    decimals: 18,
    lookupName: 'badger-dao',
    name: 'Badger',
    symbol: 'BADGER',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_WFTM]: {
    address: TOKENS.FTM_WFTM,
    decimals: 18,
    name: 'Wrapped Fantom',
    lookupName: 'fantom',
    symbol: 'WFTM',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_WBTC]: {
    address: TOKENS.FTM_WBTC,
    decimals: 8,
    lookupName: 'wrapped-bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_DAI]: {
    address: TOKENS.FTM_DAI,
    decimals: 18,
    name: 'Dai',
    lookupName: 'dai',
    symbol: 'DAI',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_BOO]: {
    address: TOKENS.FTM_BOO,
    decimals: 18,
    name: 'SpookyToken',
    lookupName: 'spookyswap',
    symbol: 'BOO',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_XBOO]: {
    address: TOKENS.FTM_XBOO,
    decimals: 18,
    name: 'Boo MirrorWorld',
    lookupName: 'boo-mirrorworld',
    symbol: 'XBOO',
    type: PricingType.LookupName,
  },
  [TOKENS.MULTI_RENBTC]: {
    address: TOKENS.MULTI_RENBTC,
    decimals: 8,
    lookupName: 'renbtc',
    name: 'Ren Protocol BTC',
    symbol: 'renBTC',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_USDC]: {
    address: TOKENS.FTM_USDC,
    decimals: 6,
    name: 'US Dollar Coin',
    lookupName: 'usd-coin',
    symbol: 'USDC',
    type: PricingType.LookupName,
  },
  [TOKENS.SMM_BOO_XBOO]: {
    address: TOKENS.SMM_BOO_XBOO,
    decimals: 18,
    lpToken: true,
    name: 'Solidly: BOO-xBOO',
    symbol: 'SMM-BOO-XBOO',
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WBTC_RENBTC]: {
    address: TOKENS.SMM_WBTC_RENBTC,
    decimals: 18,
    lpToken: true,
    name: 'Solidly: WBTC-renBTC',
    symbol: 'SMM-WBTC-RENBTC',
    type: PricingType.UniV2LP,
  },
  [TOKENS.BSMM_BOO_XBOO]: {
    address: TOKENS.BSMM_BOO_XBOO,
    decimals: 18,
    name: 'bSolidly: BOO-xBOO',
    symbol: 'bSMM-BOO-XBOO',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_BOO_XBOO,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WBTC_RENBTC]: {
    address: TOKENS.BSMM_WBTC_RENBTC,
    decimals: 18,
    name: 'bSolidly: WBTC-renBTC',
    symbol: 'bSMM-WBTC-RENBTC',
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WBTC_RENBTC,
      network: Network.Fantom,
    },
  },
};
