"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arbitrumTokensConfig = void 0;
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../../config/tokens.config");
const pricing_type_enum_1 = require("../../prices/enums/pricing-type.enum");
exports.arbitrumTokensConfig = {
    [tokens_config_1.TOKENS.ARB_USDT]: {
        lookupName: 'tether',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_IBBTC]: {
        lookupName: 'interest-bearing-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_BADGER]: {
        lookupName: 'badger-dao',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_CRV]: {
        lookupName: 'curve-dao-token',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MULTI_RENBTC]: {
        lookupName: 'renbtc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_WETH]: {
        lookupName: 'ethereum',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_WBTC]: {
        lookupName: 'bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_SUSHI]: {
        lookupName: 'sushi',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_SWAPR]: {
        lookupName: 'swapr',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.ARB_SUSHI_WETH_SUSHI]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.ARB_SUSHI_WETH_WBTC]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.ARB_CRV_RENBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.ARB_CRV_TRICRYPTO]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.ARB_SWP_SWPR_WETH]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.ARB_SWP_WBTC_WETH]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.ARB_SWP_BADGER_WETH]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.ARB_SWP_IBBTC_WETH]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.BARB_SUSHI_WETH_SUSHI]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_SUSHI_WETH_SUSHI,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_SUSHI_WETH_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_SUSHI_WETH_WBTC,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_CRV_RENBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_CRV_RENBTC,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_CRV_TRICRYPTO]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_CRV_TRICRYPTO,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_CRV_TRICRYPTO_LITE]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_CRV_TRICRYPTO,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_SWP_SWPR_WETH]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_SWP_SWPR_WETH,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_SWP_WBTC_WETH]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_SWP_WBTC_WETH,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_SWP_BADGER_WETH]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_SWP_BADGER_WETH,
            network: sdk_1.Network.Arbitrum,
        },
    },
    [tokens_config_1.TOKENS.BARB_SWP_IBBTC_WETH]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.ARB_SWP_IBBTC_WETH,
            network: sdk_1.Network.Arbitrum,
        },
    },
};
//# sourceMappingURL=arbitrum-tokens.config.js.map