"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maticTokensConfig = void 0;
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../../config/tokens.config");
const pricing_type_enum_1 = require("../../prices/enums/pricing-type.enum");
exports.maticTokensConfig = {
    [tokens_config_1.TOKENS.MATIC_WMATIC]: {
        lookupName: 'matic-network',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MULTI_RENBTC]: {
        lookupName: 'renbtc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_WBTC]: {
        lookupName: 'wrapped-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_USDC]: {
        lookupName: 'usd-coin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_USDT]: {
        lookupName: 'tether',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_DAI]: {
        lookupName: 'dai',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_IBBTC]: {
        lookupName: 'interest-bearing-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_AMWBTC]: {
        lookupName: 'aave-polygon-wbtc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_AMWETH]: {
        lookupName: 'aave-polygon-weth',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_AMDAI]: {
        lookupName: 'aave-polygon-dai',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_AMUSDC]: {
        lookupName: 'aave-polygon-usdc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_AMUSDT]: {
        lookupName: 'aave-polygon-usdt',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_CRV]: {
        lookupName: 'curve-dao-token',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_BADGER]: {
        lookupName: 'badger-dao',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_SUSHI]: {
        lookupName: 'sushi',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MATIC_SUSHI_IBBTC_WBTC]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.MATIC_QUICK_USDC_WBTC]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.MATIC_CRV_AM3CRV]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.MATIC_CRV_AMWBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.BMATIC_SUSHI_IBBTC_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.MATIC_SUSHI_IBBTC_WBTC,
            network: sdk_1.Network.Polygon,
        },
    },
    [tokens_config_1.TOKENS.BMATIC_QUICK_USDC_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.MATIC_QUICK_USDC_WBTC,
            network: sdk_1.Network.Polygon,
        },
    },
    [tokens_config_1.TOKENS.BMATIC_CRV_AMWBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.MATIC_CRV_AMWBTC,
            network: sdk_1.Network.Polygon,
        },
    },
};
//# sourceMappingURL=polygon-tokens.config.js.map