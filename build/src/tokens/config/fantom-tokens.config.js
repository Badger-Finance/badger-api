"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fantomTokensConfig = void 0;
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../../config/tokens.config");
const pricing_type_enum_1 = require("../../prices/enums/pricing-type.enum");
exports.fantomTokensConfig = {
  [tokens_config_1.TOKENS.MULTI_BADGER]: {
    lookupName: "badger-dao",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_WFTM]: {
    lookupName: "fantom",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_GEIST]: {
    lookupName: "geist-finance",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_G3CRV]: {
    type: pricing_type_enum_1.PricingType.CurveLP
  },
  [tokens_config_1.TOKENS.FTM_WEVE]: {
    lookupName: "vedao",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_DEI]: {
    lookupName: "dei-token",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_WBTC]: {
    lookupName: "wrapped-bitcoin",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_OXD]: {
    lookupName: "0xdao",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_OXD_2]: {
    lookupName: "0xdao-v2",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_OXSOLID]: {
    lookupName: "oxsolid",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_SOLID]: {
    lookupName: "0xe4bc39fdD4618a76f6472079C329bdfa820afA75",
    type: pricing_type_enum_1.PricingType.OnChainUniV2LP
  },
  [tokens_config_1.TOKENS.FTM_SOLIDSEX]: {
    lookupName: "0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8",
    type: pricing_type_enum_1.PricingType.OnChainUniV2LP
  },
  [tokens_config_1.TOKENS.FTM_SEX]: {
    lookupName: "solidex",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_GDAI]: {
    lookupName: "dai",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_DAI]: {
    lookupName: "dai",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_CRV]: {
    lookupName: "curve-dao-token",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_BOO]: {
    lookupName: "spookyswap",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_MIM]: {
    lookupName: "magic-internet-money",
    type: pricing_type_enum_1.PricingType.Contract
  },
  [tokens_config_1.TOKENS.FTM_XBOO]: {
    lookupName: "boo-mirrorworld",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_DEUS]: {
    lookupName: "deus-finance-2",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.MULTI_RENBTC]: {
    lookupName: "renbtc",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_GUSDC]: {
    lookupName: "usd-coin",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_USDC]: {
    lookupName: "usd-coin",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_GUSDT]: {
    lookupName: "tether",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_USDT]: {
    lookupName: "tether",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_SCREAM]: {
    lookupName: "scream",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.FTM_TOMB]: {
    lookupName: "tomb",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.SMM_BOO_XBOO]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_WBTC_RENBTC]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_WFTM_SEX]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_SOLID_SOLIDSEX]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_WEVE_USDC]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_OXD_USDC]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_WFTM_CRV]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_USDC_MIM]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_WFTM_RENBTC]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_GEIST_3CRV]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_WFTM_SCREAM]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_WFTM_TOMB]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_BVEOXD_OXD]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SMM_USDC_DEI]: {
    lpToken: true,
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.BSMM_GEIST_3CRV_DCA]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_GEIST_3CRV,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_BOO_XBOO_ECO]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_BOO_XBOO,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WBTC_RENBTC]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WBTC_RENBTC,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WFTM_SEX]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_SEX,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_SOLID_SOLIDSEX]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_SEX,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WEVE_USDC]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WEVE_USDC,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_OXD_USDC]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_OXD_USDC,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WFTM_CRV]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_CRV,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WFTM_CRV_ECO]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_CRV,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_USDC_MIM]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_USDC_MIM,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WFTM_RENBTC]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_RENBTC,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_USDC_MIM_ECO]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_USDC_MIM,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WFTM_SCREAM_ECO]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_SCREAM,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WFTM_RENBTC_ECO]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_RENBTC,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_WFTM_TOMB_ECO]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_WFTM_TOMB,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BVEOXD]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.FTM_OXD_2,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BOXSOLID]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.FTM_OXSOLID,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_BVEOXD_OXD]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_BVEOXD_OXD,
      network: sdk_1.Network.Fantom
    }
  },
  [tokens_config_1.TOKENS.BSMM_USDC_DEI]: {
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.SMM_USDC_DEI,
      network: sdk_1.Network.Fantom
    }
  }
};
//# sourceMappingURL=fantom-tokens.config.js.map
