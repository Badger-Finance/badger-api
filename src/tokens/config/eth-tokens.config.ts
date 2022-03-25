import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { getRemDiggPrice } from '../../prices/custom/remdigg-price';
import { getImBtcPrice, getMhBtcPrice } from '../../protocols/strategies/mstable.strategy';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const ethTokensConfig: TokenConfig = {
  [TOKENS.BADGER]: {
    lookupName: 'badger-dao',
    type: PricingType.LookupName,
  },
  [TOKENS.WBTC]: {
    lookupName: 'wrapped-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.WETH]: {
    type: PricingType.Contract,
  },
  [TOKENS.RENBTC]: {
    lookupName: 'renbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.CRV_RENBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.CRV_BADGER]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.SBTC]: {
    lookupName: 'sbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.MTA]: {
    type: PricingType.Contract,
  },
  [TOKENS.MBTC]: {
    lookupName: 'renbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.IMBTC]: {
    getPrice: getImBtcPrice,
    type: PricingType.Custom,
  },
  [TOKENS.MHBTC]: {
    getPrice: getMhBtcPrice,
    type: PricingType.Custom,
  },
  [TOKENS.CRV_CVXBVECVX]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.CRV_SBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.TBTC]: {
    lookupName: 'tbtc',
    type: PricingType.LookupName,
  },
  [TOKENS.CRV_TBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.DIGG]: {
    type: PricingType.Contract,
  },
  [TOKENS.REMDIGG]: {
    getPrice: getRemDiggPrice,
    type: PricingType.Custom,
  },
  [TOKENS.SUSHI]: {
    type: PricingType.Contract,
  },
  [TOKENS.XSUSHI]: {
    type: PricingType.Contract,
  },
  [TOKENS.WIBBTC]: {
    lookupName: 'interest-bearing-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.IBBTC]: {
    lookupName: 'interest-bearing-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.HBTC]: {
    lookupName: 'huobi-btc',
    type: PricingType.LookupName,
  },
  [TOKENS.CRV_HBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.PBTC]: {
    lookupName: 'ptokens-btc',
    type: PricingType.LookupName,
  },
  [TOKENS.CRV_PBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.OBTC]: {
    lookupName: 'wrapped-bitcoin',
    type: PricingType.LookupName,
  },
  [TOKENS.CRV_OBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.BBTC]: {
    lookupName: 'binance-wrapped-btc',
    type: PricingType.LookupName,
  },
  [TOKENS.CRV_BBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.CRV_IBBTC]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.CRV]: {
    type: PricingType.Contract,
  },
  [TOKENS.DAI]: {
    type: PricingType.Contract,
  },
  [TOKENS.USDC]: {
    type: PricingType.Contract,
  },
  [TOKENS.FRAX]: {
    type: PricingType.Contract,
  },
  [TOKENS.MIM]: {
    type: PricingType.Contract,
  },
  [TOKENS.USDT]: {
    type: PricingType.Contract,
  },
  [TOKENS.CVX]: {
    type: PricingType.Contract,
  },
  [TOKENS.CVXCRV]: {
    type: PricingType.Contract,
  },
  [TOKENS.CRV_THREE]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.CRV_MIM_3CRV]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.CRV_FRAX_3CRV]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.BOR]: {
    type: PricingType.Contract,
  },
  [TOKENS.BOR_OLD]: {
    type: PricingType.Contract,
  },
  [TOKENS.PNT]: {
    type: PricingType.Contract,
  },
  [TOKENS.KEEP]: {
    type: PricingType.Contract,
  },
  [TOKENS.CRV_TRICRYPTO]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.CRV_TRICRYPTO2]: {
    type: PricingType.CurveLP,
  },
  [TOKENS.SUSHI_BADGER_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.SUSHI_DIGG_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.SUSHI_ETH_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.SUSHI_IBBTC_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.UNI_BADGER_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.UNI_DIGG_WBTC]: {
    type: PricingType.UniV2LP,
  },
  [TOKENS.FARM]: {
    type: PricingType.Contract,
  },
  [TOKENS.DEFI_DOLLAR]: {
    type: PricingType.Contract,
  },
  [TOKENS.SPELL]: {
    type: PricingType.Contract,
  },
  [TOKENS.BBADGER]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.BADGER,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BREMBADGER]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.BADGER,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BDIGG]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.DIGG,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BUNI_DIGG_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.UNI_DIGG_WBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BUNI_BADGER_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.UNI_BADGER_WBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BSUSHI_ETH_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_ETH_WBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BSUSHI_IBBTC_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_IBBTC_WBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BSUSHI_BADGER_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_BADGER_WBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BSUSHI_DIGG_WBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_DIGG_WBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_RENBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_RENBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_SBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_SBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_TBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_TBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_HRENBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_RENBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_IBBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_IBBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BVYWBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.WBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_HBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_HBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_PBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_PBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_OBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_OBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_BBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_RENBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_MIM_3CRV]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_MIM_3CRV,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_FRAX_3CRV]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_FRAX_3CRV,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_TRICRYPTO]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_TRICRYPTO,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_TRICRYPTO2]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_TRICRYPTO2,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCVX]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CVX,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BVECVX]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CVX,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCVXCRV]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CVXCRV,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BIMBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.IMBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BMHBTC]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.MHBTC,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_CVXBVECVX]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_CVXBVECVX,
      network: Network.Ethereum,
    },
  },
  [TOKENS.BCRV_BADGER]: {
    type: PricingType.Vault,
    vaultToken: {
      address: TOKENS.CRV_BADGER,
      network: Network.Ethereum,
    },
  },
};
