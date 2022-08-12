"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bscTokensConfig = void 0;
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../../config/tokens.config");
const pricing_type_enum_1 = require("../../prices/enums/pricing-type.enum");
exports.bscTokensConfig = {
    [tokens_config_1.TOKENS.CAKE]: {
        lookupName: 'pancakeswap-token',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.WBNB]: {
        lookupName: 'binancecoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.BTCB]: {
        lookupName: 'binance-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.PANCAKE_BNB_BTCB]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.PANCAKE_OLD_BNB_BTCB]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.PANCAKE_BBADGER_BTCB]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.PANCAKE_BDIGG_BTCB]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.MULTI_BADGER]: {
        lookupName: 'badger-dao',
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.BSC_BBADGER]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BBADGER,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BSC_BDIGG]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BDIGG,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BPANCAKE_BNB_BTCB]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.PANCAKE_BNB_BTCB,
            network: sdk_1.Network.BinanceSmartChain,
        },
    },
    [tokens_config_1.TOKENS.BPANCAKE_BBADGER_BTCB]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.PANCAKE_BBADGER_BTCB,
            network: sdk_1.Network.BinanceSmartChain,
        },
    },
    [tokens_config_1.TOKENS.BPANCAKE_BDIGG_BTCB]: {
        lpToken: true,
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.PANCAKE_BDIGG_BTCB,
            network: sdk_1.Network.BinanceSmartChain,
        },
    },
};
//# sourceMappingURL=bsc-tokens.config.js.map