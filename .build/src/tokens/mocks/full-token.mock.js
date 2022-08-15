"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullTokenMockMap = void 0;
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../../config/tokens.config");
const pricing_type_enum_1 = require("../../prices/enums/pricing-type.enum");
// temp solution, remove after sdk lib mocks
exports.fullTokenMockMap = {
  [tokens_config_1.TOKENS.BADGER]: {
    address: tokens_config_1.TOKENS.BADGER,
    decimals: 18,
    name: "Badger",
    symbol: "BADGER",
    lookupName: "badger-dao",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.CTDL]: {
    address: tokens_config_1.TOKENS.CTDL,
    decimals: 18,
    name: "Citadel",
    symbol: "CTDL",
    lookupName: "citadel-dao",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.XCTDL]: {
    address: tokens_config_1.TOKENS.XCTDL,
    decimals: 18,
    name: "Staked Citadel",
    symbol: "xCTDL",
    lookupName: "citadel-dao",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.DIGG]: {
    address: tokens_config_1.TOKENS.DIGG,
    decimals: 9,
    name: "Digg",
    symbol: "DIGG",
    type: pricing_type_enum_1.PricingType.Contract
  },
  [tokens_config_1.TOKENS.WBTC]: {
    address: tokens_config_1.TOKENS.WBTC,
    decimals: 8,
    lookupName: "wrapped-bitcoin",
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.WETH]: {
    address: tokens_config_1.TOKENS.WETH,
    decimals: 18,
    name: "Wrapped Ethereum",
    symbol: "WETH",
    type: pricing_type_enum_1.PricingType.Contract
  },
  [tokens_config_1.TOKENS.FTM_GEIST]: {
    address: tokens_config_1.TOKENS.FTM_GEIST,
    decimals: 18,
    name: "Geist",
    lookupName: "geist-finance",
    symbol: "GEIST",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.BBADGER]: {
    address: tokens_config_1.TOKENS.BBADGER,
    decimals: 18,
    name: "bBadger",
    symbol: "bBADGER",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.BADGER,
      network: sdk_1.Network.Ethereum
    }
  },
  [tokens_config_1.TOKENS.BDIGG]: {
    address: tokens_config_1.TOKENS.BDIGG,
    decimals: 18,
    name: "bDigg",
    symbol: "bDIGG",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.DIGG,
      network: sdk_1.Network.Ethereum
    }
  },
  [tokens_config_1.TOKENS.CVX]: {
    address: tokens_config_1.TOKENS.CVX,
    decimals: 18,
    name: "Convex Token",
    symbol: "CVX",
    type: pricing_type_enum_1.PricingType.Contract
  },
  [tokens_config_1.TOKENS.BCVXCRV]: {
    address: tokens_config_1.TOKENS.BCVXCRV,
    decimals: 18,
    name: "bCVXCRV",
    symbol: "bCVXCRV",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.CVXCRV,
      network: sdk_1.Network.Ethereum
    }
  },
  [tokens_config_1.TOKENS.BVECVX]: {
    address: tokens_config_1.TOKENS.BVECVX,
    decimals: 18,
    name: "bVECVX",
    symbol: "bVECVX",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.CVX,
      network: sdk_1.Network.Ethereum
    }
  },
  [tokens_config_1.TOKENS.BCRV_IBBTC]: {
    address: tokens_config_1.TOKENS.BCRV_IBBTC,
    decimals: 18,
    name: "bcrvIbbtc",
    symbol: "bcrvIbbtc",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.CRV_IBBTC,
      network: sdk_1.Network.Ethereum
    }
  },
  [tokens_config_1.TOKENS.BMATIC_QUICK_USDC_WBTC]: {
    address: tokens_config_1.TOKENS.BMATIC_QUICK_USDC_WBTC,
    decimals: 18,
    name: "bQuickswap: USDC-WBTC",
    symbol: "bQLP-USDC-WBTC",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.MATIC_QUICK_USDC_WBTC,
      network: sdk_1.Network.Polygon
    }
  },
  [tokens_config_1.TOKENS.MATIC_QUICK_USDC_WBTC]: {
    address: tokens_config_1.TOKENS.MATIC_QUICK_USDC_WBTC,
    decimals: 18,
    lpToken: true,
    name: "Quickswap: USDC-WBTC",
    symbol: "QLP-USDC-WBTC",
    type: pricing_type_enum_1.PricingType.UniV2LP
  },
  [tokens_config_1.TOKENS.SUSHI_BADGER_WBTC]: {
    address: tokens_config_1.TOKENS.SUSHI_BADGER_WBTC,
    decimals: 18,
    lpToken: true,
    name: "Sushiswap: WBTC-BADGER",
    symbol: "SLP-BADGER-WBTC",
    type: pricing_type_enum_1.PricingType.LookupName
  },
  [tokens_config_1.TOKENS.BSUSHI_ETH_WBTC]: {
    address: tokens_config_1.TOKENS.BSUSHI_ETH_WBTC,
    decimals: 18,
    name: "bSushiSwap: WBTC-ETH",
    symbol: "bSLP-WBTC-ETH",
    type: pricing_type_enum_1.PricingType.Vault,
    lpToken: true,
    vaultToken: {
      address: tokens_config_1.TOKENS.SUSHI_ETH_WBTC,
      network: sdk_1.Network.Ethereum
    }
  },
  [tokens_config_1.TOKENS.SUSHI_ETH_WBTC]: {
    address: tokens_config_1.TOKENS.SUSHI_ETH_WBTC,
    decimals: 18,
    name: "Sushiswap: WBTC-ETH",
    symbol: "SLP-WBTC-ETH",
    type: pricing_type_enum_1.PricingType.Vault
  },
  [tokens_config_1.TOKENS.BCRV_TBTC]: {
    address: tokens_config_1.TOKENS.BCRV_TBTC,
    decimals: 18,
    name: "bCurve.fi tBTC/sbtcCrv",
    symbol: "btBTCCRV",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.CRV_TBTC,
      network: sdk_1.Network.Ethereum
    }
  },
  [tokens_config_1.TOKENS.BCRV_SBTC]: {
    address: tokens_config_1.TOKENS.BCRV_SBTC,
    decimals: 18,
    name: "bCurve.fi renBTC/wBTC/sBTC",
    symbol: "bsBTCCRV",
    type: pricing_type_enum_1.PricingType.Vault,
    vaultToken: {
      address: tokens_config_1.TOKENS.CRV_SBTC,
      network: sdk_1.Network.Ethereum
    }
  }
};
//# sourceMappingURL=full-token.mock.js.map
