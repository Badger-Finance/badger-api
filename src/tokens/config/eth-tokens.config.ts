import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { TOKENS } from '../../config/tokens.config';
import { getImBtcPrice, getMhBtcPrice } from '../../protocols/strategies/mstable.strategy';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const ethTokensConfig: TokenConfig = {
  [TOKENS.BADGER]: {
    address: TOKENS.BADGER,
    decimals: 18,
    name: 'Badger',
    symbol: 'BADGER',
    type: TokenType.Contract,
  },
  [TOKENS.WBTC]: {
    address: TOKENS.WBTC,
    decimals: 8,
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: TokenType.Contract,
  },
  [TOKENS.WETH]: {
    address: TOKENS.WETH,
    decimals: 18,
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    type: TokenType.Contract,
  },
  [TOKENS.RENBTC]: {
    address: TOKENS.RENBTC,
    decimals: 8,
    lookupName: 'renbtc',
    name: 'Ren Protocol BTC',
    symbol: 'renBTC',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_RENBTC]: {
    address: TOKENS.CRV_RENBTC,
    decimals: 18,
    name: 'Curve.fi: renBTC/wBTC',
    symbol: 'crvrenWBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.SBTC]: {
    address: TOKENS.SBTC,
    decimals: 18,
    lookupName: 'sbtc',
    name: 'Synthetix Network BTC',
    symbol: 'sBTC',
    type: TokenType.Contract,
  },
  [TOKENS.MTA]: {
    address: TOKENS.MTA,
    decimals: 18,
    name: 'Meta',
    symbol: 'MTA',
    type: TokenType.Contract,
  },
  [TOKENS.MBTC]: {
    address: TOKENS.MBTC,
    decimals: 18,
    lookupName: 'renbtc',
    name: 'mBTC',
    symbol: 'mBTC',
    type: TokenType.Contract,
  },
  [TOKENS.IMBTC]: {
    address: TOKENS.IMBTC,
    decimals: 18,
    getPrice: getImBtcPrice,
    name: 'imBTC',
    symbol: 'imBTC',
    type: TokenType.Custom,
  },
  [TOKENS.MHBTC]: {
    address: TOKENS.MHBTC,
    decimals: 18,
    getPrice: getMhBtcPrice,
    name: 'mhBTC',
    symbol: 'mhBTC',
    type: TokenType.Custom,
  },
  [TOKENS.CRV_CVXBVECVX]: {
    address: TOKENS.CRV_CVXBVECVX,
    decimals: 18,
    name: 'Curve.fi CVX/bveCVX',
    symbol: 'crvCVXbveCVX',
    type: TokenType.CurveLP,
  },
  [TOKENS.CRV_SBTC]: {
    address: TOKENS.CRV_SBTC,
    decimals: 18,
    name: 'Curve.fi renBTC/wBTC/sBTC',
    symbol: 'crvsBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.TBTC]: {
    address: TOKENS.TBTC,
    decimals: 18,
    lookupName: 'tbtc',
    name: 'Keep Network BTC',
    symbol: 'TBTC',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_TBTC]: {
    address: TOKENS.CRV_TBTC,
    decimals: 18,
    name: 'Curve.fi tBTC',
    symbol: 'crvtBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.DIGG]: {
    address: TOKENS.DIGG,
    decimals: 9,
    lookupName: TOKENS.SUSHI_DIGG_WBTC,
    name: 'Digg',
    symbol: 'DIGG',
    type: TokenType.Contract,
  },
  [TOKENS.SUSHI]: {
    address: TOKENS.SUSHI,
    decimals: 18,
    name: 'Sushi',
    symbol: 'Sushi',
    type: TokenType.Contract,
  },
  [TOKENS.XSUSHI]: {
    address: TOKENS.XSUSHI,
    decimals: 18,
    name: 'xSushi',
    symbol: 'xSUSHI',
    type: TokenType.Contract,
  },
  [TOKENS.IBBTC]: {
    address: TOKENS.IBBTC,
    decimals: 18,
    lookupName: 'interest-bearing-bitcoin',
    name: 'ibBTC',
    symbol: 'ibBTC',
    type: TokenType.Contract,
  },
  [TOKENS.HBTC]: {
    address: TOKENS.HBTC,
    decimals: 18,
    lookupName: 'huobi-btc',
    name: 'Huobi BTC',
    symbol: 'HBTC',
    type: TokenType.Contract,
  },
  [TOKENS.DROPT_2]: {
    address: TOKENS.DROPT_2,
    decimals: 18,
    lookupName: 'dropt-2',
    name: 'DIGG Rebase Option 2',
    symbol: 'DROPT-2',
    type: TokenType.Contract,
  },
  [TOKENS.DROPT_3]: {
    address: TOKENS.DROPT_3,
    decimals: 18,
    lookupName: 'dropt-3',
    name: 'DIGG Rebase Option 3',
    symbol: 'DROPT-3',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_HBTC]: {
    address: TOKENS.CRV_HBTC,
    decimals: 18,
    name: 'Curve.fi hBTC',
    symbol: 'crvhBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.PBTC]: {
    address: TOKENS.PBTC,
    decimals: 18,
    lookupName: 'ptokens-btc',
    name: 'pTokens BTC',
    symbol: 'PBTC',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_PBTC]: {
    address: TOKENS.CRV_PBTC,
    decimals: 18,
    name: 'Curve.fi pBTC',
    symbol: 'crvpBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.OBTC]: {
    address: TOKENS.OBTC,
    decimals: 18,
    lookupName: 'wrapped-bitcoin',
    name: 'Boring DAO BTC',
    symbol: 'OBTC',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_OBTC]: {
    address: TOKENS.CRV_OBTC,
    decimals: 18,
    name: 'Curve.fi oBTC',
    symbol: 'crvoBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.BBTC]: {
    address: TOKENS.BBTC,
    decimals: 8,
    lookupName: 'binance-wrapped-btc',
    name: 'Binance Wrapped BTC',
    symbol: 'BBTC',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_BBTC]: {
    address: TOKENS.CRV_BBTC,
    decimals: 18,
    name: 'Curve.fi bBTC',
    symbol: 'crvbBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.CRV]: {
    address: TOKENS.CRV,
    decimals: 18,
    name: 'Curve DAO Token',
    symbol: 'CRV',
    type: TokenType.Contract,
  },
  [TOKENS.DAI]: {
    address: TOKENS.DAI,
    decimals: 18,
    name: 'Dai',
    symbol: 'DAI',
    type: TokenType.Contract,
  },
  [TOKENS.USDC]: {
    address: TOKENS.USDC,
    decimals: 6,
    name: 'US Dollar Coin',
    symbol: 'USDC',
    type: TokenType.Contract,
  },
  [TOKENS.USDT]: {
    address: TOKENS.USDT,
    decimals: 6,
    name: 'Tether',
    symbol: 'USDT',
    type: TokenType.Contract,
  },
  [TOKENS.CVX]: {
    address: TOKENS.CVX,
    decimals: 18,
    name: 'Convex Token',
    symbol: 'CVX',
    type: TokenType.Contract,
  },
  [TOKENS.CVXCRV]: {
    address: TOKENS.CVXCRV,
    decimals: 18,
    name: 'Convex CRV',
    symbol: 'cvxCRV',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_THREE]: {
    address: TOKENS.CRV_THREE,
    decimals: 18,
    name: 'Curve.fi 3crv',
    symbol: '3CRV',
    type: TokenType.CurveLP,
  },
  [TOKENS.BOR]: {
    address: TOKENS.BOR,
    decimals: 18,
    name: 'BoringDAO Token',
    symbol: 'BOR',
    type: TokenType.Contract,
  },
  [TOKENS.BOR_OLD]: {
    address: TOKENS.BOR_OLD,
    decimals: 18,
    name: 'BoringDAO Token',
    symbol: 'BOR',
    type: TokenType.Contract,
  },
  [TOKENS.PNT]: {
    address: TOKENS.PNT,
    decimals: 18,
    name: 'pNetwork Token',
    symbol: 'PNT',
    type: TokenType.Contract,
  },
  [TOKENS.KEEP]: {
    address: TOKENS.KEEP,
    decimals: 18,
    name: 'Keep Network',
    symbol: 'KEEP',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_TRICRYPTO]: {
    address: TOKENS.CRV_TRICRYPTO,
    decimals: 18,
    name: 'Curve.fi Tricrypto',
    symbol: 'crvTricrypto',
    type: TokenType.CurveLP,
  },
  [TOKENS.CRV_TRICRYPTO2]: {
    address: TOKENS.CRV_TRICRYPTO2,
    decimals: 18,
    name: 'Curve.fi Tricrypto2',
    symbol: 'crvTricrypto2',
    type: TokenType.CurveLP,
  },
  [TOKENS.SUSHI_BADGER_WBTC]: {
    address: TOKENS.SUSHI_BADGER_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: WBTC-BADGER',
    symbol: 'SLP-BADGER-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.SUSHI_DIGG_WBTC]: {
    address: TOKENS.SUSHI_DIGG_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: WBTC-DIGG',
    symbol: 'SLP-DIGG-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.SUSHI_ETH_WBTC]: {
    address: TOKENS.SUSHI_ETH_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: WBTC-ETH',
    symbol: 'SLP-WBTC-ETH',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.SUSHI_IBBTC_WBTC]: {
    address: TOKENS.SUSHI_IBBTC_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: ibBTC-WBTC',
    symbol: 'SLP-IBBTC-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.UNI_BADGER_WBTC]: {
    address: TOKENS.UNI_BADGER_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Uniswap V2: WBTC-BADGER',
    symbol: 'BADGER-WBTC',
    type: TokenType.UniswapLp,
  },
  [TOKENS.UNI_DIGG_WBTC]: {
    address: TOKENS.UNI_DIGG_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Uniswap V2: WBTC-DIGG',
    symbol: 'DIGG-WBTC',
    type: TokenType.UniswapLp,
  },
  [TOKENS.FARM]: {
    address: TOKENS.FARM,
    decimals: 18,
    name: 'Farm',
    symbol: 'FARM',
    type: TokenType.Contract,
  },
  [TOKENS.DEFI_DOLLAR]: {
    address: TOKENS.DEFI_DOLLAR,
    decimals: 18,
    name: 'DeFi Dollar',
    symbol: 'DFD',
    type: TokenType.Contract,
  },
  [TOKENS.BBADGER]: {
    address: TOKENS.BBADGER,
    decimals: 18,
    name: 'bBadger',
    symbol: 'bBADGER',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.BADGER,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BDIGG]: {
    address: TOKENS.BDIGG,
    decimals: 18,
    name: 'bDigg',
    symbol: 'bDIGG',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.DIGG,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BZS_DIGG]: {
    address: TOKENS.BZS_DIGG,
    decimals: 18,
    name: 'bzsDigg',
    symbol: 'bzsDIGG',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.DIGG,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BUNI_DIGG_WBTC]: {
    address: TOKENS.BUNI_DIGG_WBTC,
    decimals: 18,
    name: 'bUniswap V2: WBTC-DIGG',
    symbol: 'bDIGG-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.UNI_DIGG_WBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BUNI_BADGER_WBTC]: {
    address: TOKENS.BUNI_BADGER_WBTC,
    decimals: 18,
    name: 'bUniswap V2: WBTC-BADGER',
    symbol: 'bBADGER-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.UNI_BADGER_WBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BSUSHI_ETH_WBTC]: {
    address: TOKENS.BSUSHI_ETH_WBTC,
    decimals: 18,
    name: 'bSushiSwap: WBTC-ETH',
    symbol: 'bSLP-WBTC-ETH',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_ETH_WBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BSUSHI_IBBTC_WBTC]: {
    address: TOKENS.BSUSHI_IBBTC_WBTC,
    decimals: 18,
    name: 'bSushiSwap: ibBTC-WBTC',
    symbol: 'bSLP-IBBTC-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_IBBTC_WBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BSUSHI_BADGER_WBTC]: {
    address: TOKENS.BSUSHI_BADGER_WBTC,
    decimals: 18,
    name: 'bSushiSwap: WBTC-BADGER',
    symbol: 'bSLP-BADGER-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_BADGER_WBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BSUSHI_DIGG_WBTC]: {
    address: TOKENS.BSUSHI_DIGG_WBTC,
    decimals: 18,
    name: 'bSushiSwap: WBTC-DIGG',
    symbol: 'bSLP-DIGG-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.SUSHI_DIGG_WBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_RENBTC]: {
    address: TOKENS.BCRV_RENBTC,
    decimals: 18,
    name: 'bCurve.fi: renCrv Token',
    symbol: 'bcrvrenBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_RENBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_SBTC]: {
    address: TOKENS.BCRV_SBTC,
    decimals: 18,
    name: 'bCurve.fi renBTC/wBTC/sBTC',
    symbol: 'bcrvsBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_SBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_TBTC]: {
    address: TOKENS.BCRV_TBTC,
    decimals: 18,
    name: 'bCurve.fi tBTC',
    symbol: 'bcrvtBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_TBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_HRENBTC]: {
    address: TOKENS.BCRV_HRENBTC,
    decimals: 18,
    name: 'bHarvest crvRenWBTC',
    symbol: 'bcrvhrenBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_RENBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BVYWBTC]: {
    address: TOKENS.BVYWBTC,
    decimals: 8,
    name: 'Yearn WBTC',
    symbol: 'bvyWBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.WBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_HBTC]: {
    address: TOKENS.BCRV_HBTC,
    decimals: 18,
    name: 'bCurve.fi hBTC/wBTC',
    symbol: 'bcrvhBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_HBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_PBTC]: {
    address: TOKENS.BCRV_PBTC,
    decimals: 18,
    name: 'bCurve.fi pBTC/wBTC',
    symbol: 'bcrvpBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_PBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_OBTC]: {
    address: TOKENS.BCRV_OBTC,
    decimals: 18,
    name: 'bCurve.fi oBTC/wBTC',
    symbol: 'bcrvoBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_OBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_BBTC]: {
    address: TOKENS.BCRV_BBTC,
    decimals: 18,
    name: 'bCurve.fi bBTC/wBTC',
    symbol: 'bcrvbBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_RENBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_TRICRYPTO]: {
    address: TOKENS.BCRV_TRICRYPTO,
    decimals: 18,
    name: 'bCurve.fi USD/BTC/ETH',
    symbol: 'bcrvTricrypto',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_TRICRYPTO,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_TRICRYPTO2]: {
    address: TOKENS.BCRV_TRICRYPTO2,
    decimals: 18,
    name: 'bCurve.fi USD/BTC/ETH',
    symbol: 'bcrvTricrypto2',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_TRICRYPTO2,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCVX]: {
    address: TOKENS.BCVX,
    decimals: 18,
    name: 'bCVX',
    symbol: 'bCVX',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CVX,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BICVX]: {
    address: TOKENS.BICVX,
    decimals: 18,
    name: 'Badger Vote Escrowed CVX',
    symbol: 'bveCVX',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CVX,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BICVX_OLD]: {
    address: TOKENS.BICVX_OLD,
    decimals: 18,
    name: 'Badger Vote Escrowed CVX',
    symbol: 'bveCVX',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.BCVX,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCVXCRV]: {
    address: TOKENS.BCVXCRV,
    decimals: 18,
    name: 'bCVXCRV',
    symbol: 'bCVXCRV',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CVXCRV,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BRENBTC]: {
    address: TOKENS.BRENBTC,
    decimals: 18,
    name: 'brenBTC',
    symbol: 'brenBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.RENBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BIMBTC]: {
    address: TOKENS.BIMBTC,
    decimals: 18,
    name: 'bimBTC',
    symbol: 'bimBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.IMBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BMHBTC]: {
    address: TOKENS.BMHBTC,
    decimals: 18,
    name: 'bmhBTC',
    symbol: 'bmhBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.MHBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_CVXBVECVX]: {
    address: TOKENS.BCRV_CVXBVECVX,
    decimals: 18,
    name: 'bcrvCVXbveCVX',
    symbol: 'bcrvCVXbveCVX',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_CVXBVECVX,
      network: ChainNetwork.Ethereum,
    },
  },
};
