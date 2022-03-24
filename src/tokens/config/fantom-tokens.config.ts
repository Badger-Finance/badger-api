import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const fantomTokensConfig: TokenConfig = {
  [TOKENS.MULTI_BADGER]: {
    lookupName: 'badger-dao',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_WFTM]: {
    lookupName: 'fantom',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_GEIST]: {
    lookupName: 'geist-finance',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_G3CRV]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.FTM_WEVE]: {
    lookupName: 'vedao',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_WBTC]: {
    lookupName: 'wrapped-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_OXD]: {
    lookupName: '0xdao',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_OXD_2]: {
    lookupName: '0xdao-v2',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_OXSOLID]: {
    lookupName: 'oxsolid',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_SOLID]: {
    lookupName: '0xe4bc39fdD4618a76f6472079C329bdfa820afA75',
    type: PricingType.OnChainUniV2LP,
  },
  [TOKENS.FTM_SOLIDSEX]: {
    lookupName: '0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8',
    type: PricingType.OnChainUniV2LP,
  },
  [TOKENS.FTM_SEX]: {
    lookupName: 'solidex',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_GDAI]: {
    lookupName: 'dai',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_DAI]: {
    lookupName: 'dai',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_CRV]: {
    lookupName: 'curve-dao-token',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_BOO]: {
    lookupName: 'spookyswap',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_MIM]: {
    lookupName: 'magic-internet-money',
    type: PricingType.Contract,
  },
  [TOKENS.FTM_XBOO]: {
    lookupName: 'boo-mirrorworld',
    type: PricingType.LookupName,
  },
  [TOKENS.MULTI_RENBTC]: {
    lookupName: 'renbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_GUSDC]: {
    lookupName: 'usd-coin',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_USDC]: {
    lookupName: 'usd-coin',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_GUSDT]: {
    lookupName: 'tether',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_USDT]: {
    lookupName: 'tether',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_SCREAM]: {
    lookupName: 'scream',
    type: PricingType.LookupName,
  },
  [TOKENS.FTM_TOMB]: {
    lookupName: 'tomb',
    type: PricingType.LookupName,
  },
  [TOKENS.SMM_BOO_XBOO]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WBTC_RENBTC]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WFTM_SEX]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_SOLID_SOLIDSEX]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WEVE_USDC]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_OXD_USDC]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WFTM_CRV]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_USDC_MIM]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WFTM_RENBTC]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_GEIST_3CRV]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WFTM_SCREAM]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.SMM_WFTM_TOMB]: {
    lpToken: true,
    type: PricingType.UniV2LP,
  },
  [TOKENS.BSMM_GEIST_3CRV_DCA]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_GEIST_3CRV,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_BOO_XBOO_ECO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_BOO_XBOO,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WBTC_RENBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WBTC_RENBTC,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WFTM_SEX]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_SEX,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_SOLID_SOLIDSEX]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_SEX,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WEVE_USDC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WEVE_USDC,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_OXD_USDC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_OXD_USDC,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WFTM_CRV]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_CRV,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WFTM_CRV_ECO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_CRV,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_USDC_MIM]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_USDC_MIM,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WFTM_RENBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_RENBTC,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_USDC_MIM_ECO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_USDC_MIM,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WFTM_SCREAM_ECO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_SCREAM,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WFTM_RENBTC_ECO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_RENBTC,
      network: Network.Fantom,
    },
  },
  [TOKENS.BSMM_WFTM_TOMB_ECO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SMM_WFTM_TOMB,
      network: Network.Fantom,
    },
  },
  [TOKENS.BOXD]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.FTM_OXD_2,
      network: Network.Fantom,
    },
  },
  [TOKENS.BOXSOLID]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.FTM_OXSOLID,
      network: Network.Fantom,
    },
  },
};
