"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethTokensConfig = void 0;
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../../config/tokens.config");
const pricing_type_enum_1 = require("../../prices/enums/pricing-type.enum");
const balancer_strategy_1 = require("../../protocols/strategies/balancer.strategy");
const convex_strategy_1 = require("../../protocols/strategies/convex.strategy");
const mstable_strategy_1 = require("../../protocols/strategies/mstable.strategy");
exports.ethTokensConfig = {
    [tokens_config_1.TOKENS.BADGER]: {
        lookupName: 'badger-dao',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.WBTC]: {
        lookupName: 'wrapped-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.WETH]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.RENBTC]: {
        lookupName: 'renbtc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.CRV_RENBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.CRV_BADGER]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.SBTC]: {
        lookupName: 'sbtc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.MTA]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.MBTC]: {
        lookupName: 'renbtc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.IMBTC]: {
        getPrice: mstable_strategy_1.getImBtcPrice,
        type: pricing_type_enum_1.PricingType.Custom,
    },
    [tokens_config_1.TOKENS.MHBTC]: {
        getPrice: mstable_strategy_1.getMhBtcPrice,
        type: pricing_type_enum_1.PricingType.Custom,
    },
    [tokens_config_1.TOKENS.CRV_CVXBVECVX]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.CRV_SBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.TBTC]: {
        lookupName: 'tbtc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.CRV_TBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.DIGG]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.SUSHI]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.XSUSHI]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.WIBBTC]: {
        lookupName: 'interest-bearing-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.IBBTC]: {
        lookupName: 'interest-bearing-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.HBTC]: {
        lookupName: 'huobi-btc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.CRV_HBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.PBTC]: {
        lookupName: 'ptokens-btc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.CRV_PBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.OBTC]: {
        lookupName: 'wrapped-bitcoin',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.CRV_OBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.BBTC]: {
        lookupName: 'binance-wrapped-btc',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.AURA]: {
        lookupName: 'aura-finance',
        type: pricing_type_enum_1.PricingType.LookupName,
    },
    [tokens_config_1.TOKENS.AURA_BAL]: {
        type: pricing_type_enum_1.PricingType.Custom,
        lookupName: '0x3dd0843A028C86e0b760b1A76929d1C5Ef93a2dd',
        getPrice: balancer_strategy_1.resolveBalancerPoolTokenPrice,
    },
    [tokens_config_1.TOKENS.CRV_BBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.CRV_IBBTC]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.CRV]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.DAI]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.USDC]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.FRAX]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.UST]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.WUST]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.MIM]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.USDT]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.CVX]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.CVXCRV]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.CRV_THREE]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.CRV_MIM_3CRV]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.CRV_FRAX_3CRV]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.BOR]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.BOR_OLD]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.PNT]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.KEEP]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.CRV_TRICRYPTO]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.CRV_TRICRYPTO2]: {
        type: pricing_type_enum_1.PricingType.CurveLP,
    },
    [tokens_config_1.TOKENS.SUSHI_BADGER_WBTC]: {
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.SUSHI_DIGG_WBTC]: {
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.SUSHI_ETH_WBTC]: {
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.SUSHI_IBBTC_WBTC]: {
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.UNI_BADGER_WBTC]: {
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.UNI_DIGG_WBTC]: {
        type: pricing_type_enum_1.PricingType.UniV2LP,
    },
    [tokens_config_1.TOKENS.FARM]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.DEFI_DOLLAR]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.SPELL]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.FXS]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.BAL]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.BB_A_DAI]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.BB_A_USDC]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.BB_A_USDT]: {
        type: pricing_type_enum_1.PricingType.Contract,
    },
    [tokens_config_1.TOKENS.CVXFXS]: {
        type: pricing_type_enum_1.PricingType.Custom,
        getPrice: convex_strategy_1.resolveCurveStablePoolTokenPrice,
    },
    [tokens_config_1.TOKENS.BPT_WBTC_BADGER]: {
        type: pricing_type_enum_1.PricingType.BalancerLP,
    },
    [tokens_config_1.TOKENS.BPT_WETH_BAL]: {
        type: pricing_type_enum_1.PricingType.BalancerLP,
    },
    [tokens_config_1.TOKENS.BPT_BB_AAVE_USD]: {
        type: pricing_type_enum_1.PricingType.BalancerLP,
    },
    [tokens_config_1.TOKENS.BPT_GRAV_AURABAL_WETH]: {
        type: pricing_type_enum_1.PricingType.BalancerLP,
    },
    [tokens_config_1.TOKENS.BPT_GRAV_DIGG_WBTC]: {
        type: pricing_type_enum_1.PricingType.BalancerLP,
    },
    [tokens_config_1.TOKENS.BBADGER]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BADGER,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BREMBADGER]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BADGER,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BDIGG]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.DIGG,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BUNI_DIGG_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.UNI_DIGG_WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BUNI_BADGER_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.UNI_BADGER_WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BSUSHI_ETH_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.SUSHI_ETH_WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BSUSHI_IBBTC_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.SUSHI_IBBTC_WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BSUSHI_BADGER_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.SUSHI_BADGER_WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BSUSHI_DIGG_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.SUSHI_DIGG_WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_RENBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_RENBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_SBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_SBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_TBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_TBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_HRENBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_RENBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_IBBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_IBBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BVYWBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_HBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_HBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_PBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_PBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_OBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_OBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_BBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_RENBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_MIM_3CRV]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_MIM_3CRV,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_FRAX_3CRV]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_FRAX_3CRV,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_TRICRYPTO]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_TRICRYPTO,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_TRICRYPTO2]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_TRICRYPTO2,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCVX]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CVX,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BVECVX]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CVX,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCVXCRV]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CVXCRV,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BIMBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.IMBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BMHBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.MHBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_CVXBVECVX]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_CVXBVECVX,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BCRV_BADGER]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.CRV_BADGER,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.GRAVI_AURA]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.AURA,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BAURA_BAL]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.AURA_BAL,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BBPT_BB_AAVE_USD]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BPT_BB_AAVE_USD,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BBPT_GRAV_AURABAL_WETH]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BPT_GRAV_AURABAL_WETH,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BBPT_WBTC_BADGER]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BPT_WBTC_BADGER,
            network: sdk_1.Network.Ethereum,
        },
    },
    [tokens_config_1.TOKENS.BBPT_GRAV_DIGG_WBTC]: {
        type: pricing_type_enum_1.PricingType.Vault,
        vaultToken: {
            address: tokens_config_1.TOKENS.BPT_GRAV_DIGG_WBTC,
            network: sdk_1.Network.Ethereum,
        },
    },
};
//# sourceMappingURL=eth-tokens.config.js.map