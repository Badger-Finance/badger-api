import { Network } from '@badger-dao/sdk';
import { TOKENS } from '../../config/tokens.config';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../interfaces/token-config.interface';

export const arbitrumTokensConfig: TokenConfig = {
  [TOKENS.ARB_USDT]: {
    address: TOKENS.ARB_USDT,
    decimals: 6,
    lookupName: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_IBBTC]: {
    address: TOKENS.ARB_IBBTC,
    decimals: 18,
    lookupName: 'interest-bearing-bitcoin',
    name: 'ibBTC',
    symbol: 'ibBTC',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_BADGER]: {
    address: TOKENS.ARB_BADGER,
    decimals: 18,
    lookupName: 'badger-dao',
    name: 'Badger',
    symbol: 'BADGER',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_CRV]: {
    address: TOKENS.ARB_CRV,
    decimals: 18,
    lookupName: 'curve-dao-token',
    name: 'Curve DAO Token',
    symbol: 'CRV',
    type: TokenType.Contract,
  },
  [TOKENS.MULTI_RENBTC]: {
    address: TOKENS.MULTI_RENBTC,
    decimals: 8,
    lookupName: 'renbtc',
    name: 'Ren Protocol BTC',
    symbol: 'renBTC',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_WETH]: {
    address: TOKENS.ARB_WETH,
    decimals: 18,
    lookupName: 'ethereum',
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_WBTC]: {
    address: TOKENS.ARB_WBTC,
    decimals: 8,
    lookupName: 'bitcoin',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_SUSHI]: {
    address: TOKENS.ARB_SUSHI,
    decimals: 18,
    lookupName: 'sushi',
    name: 'Sushi',
    symbol: 'SUSHI',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_SWAPR]: {
    address: TOKENS.ARB_SWAPR,
    decimals: 18,
    lookupName: TOKENS.ARB_SWP_SWAPR_WETH,
    name: 'Swapr',
    symbol: 'SWAPR',
    type: TokenType.Contract,
  },
  [TOKENS.ARB_SUSHI_WETH_SUSHI]: {
    address: TOKENS.ARB_SUSHI_WETH_SUSHI,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: WETH-SUSHI',
    symbol: 'SLP-WETH-SUSHI',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.ARB_SUSHI_WETH_WBTC]: {
    address: TOKENS.ARB_SUSHI_WETH_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Sushiswap: WETH-WBTC',
    symbol: 'SLP-WETH-WBTC',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.ARB_CRV_RENBTC]: {
    address: TOKENS.ARB_CRV_RENBTC,
    decimals: 18,
    name: 'Curve.fi: renBTC/wBTC',
    symbol: 'crvrenWBTC',
    type: TokenType.CurveLP,
  },
  [TOKENS.ARB_CRV_TRICRYPTO]: {
    address: TOKENS.ARB_CRV_TRICRYPTO,
    decimals: 18,
    name: 'Curve.fi Tricrypto',
    symbol: 'crvTricrypto',
    type: TokenType.CurveLP,
  },
  [TOKENS.ARB_SWP_SWPR_WETH]: {
    address: TOKENS.ARB_SWP_SWPR_WETH,
    decimals: 18,
    lpToken: true,
    name: 'Swapr SWPR-WETH',
    symbol: 'SWLP-SWPR-WETH',
    type: TokenType.SwaprLp,
  },
  [TOKENS.ARB_SWP_WBTC_WETH]: {
    address: TOKENS.ARB_SWP_WBTC_WETH,
    decimals: 18,
    lpToken: true,
    name: 'Swapr WBTC-WETH',
    symbol: 'SWLP-WBTC-WETH',
    type: TokenType.SwaprLp,
  },
  [TOKENS.ARB_SWP_BADGER_WETH]: {
    address: TOKENS.ARB_SWP_BADGER_WETH,
    decimals: 18,
    lpToken: true,
    name: 'Swapr BADGER-WETH',
    symbol: 'SWLP-BADGER-WETH',
    type: TokenType.SwaprLp,
  },
  [TOKENS.ARB_SWP_IBBTC_WETH]: {
    address: TOKENS.ARB_SWP_IBBTC_WETH,
    decimals: 18,
    lpToken: true,
    name: 'Swapr ibBTC-WETH',
    symbol: 'SWLP-IBBTC-WETH',
    type: TokenType.SwaprLp,
  },
  [TOKENS.BARB_SUSHI_WETH_SUSHI]: {
    address: TOKENS.BARB_SUSHI_WETH_SUSHI,
    decimals: 18,
    name: 'bSushiswap: WETH-SUSHI',
    symbol: 'bSLP-WETH-SUSHI',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SUSHI_WETH_SUSHI,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SUSHI_WETH_WBTC]: {
    address: TOKENS.BARB_SUSHI_WETH_WBTC,
    decimals: 18,
    name: 'bSushiswap: WETH-WBTC',
    symbol: 'bSLP-WETH-WBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SUSHI_WETH_WBTC,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_CRV_RENBTC]: {
    address: TOKENS.BARB_CRV_RENBTC,
    decimals: 18,
    name: 'bCurve.fi wBTC/renBTC',
    symbol: 'bcrvrenBTC',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_RENBTC,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_CRV_TRICRYPTO]: {
    address: TOKENS.BARB_CRV_TRICRYPTO,
    decimals: 18,
    name: 'bCurve.fi Tricrypto',
    symbol: 'bcrvTricrypto',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_TRICRYPTO,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_CRV_TRICRYPTO_LITE]: {
    address: TOKENS.BARB_CRV_TRICRYPTO_LITE,
    decimals: 18,
    name: 'bCurve.fi Tricrypto Light',
    symbol: 'bcrvTricryptoLight',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_CRV_TRICRYPTO,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_SWPR_WETH]: {
    address: TOKENS.BARB_SWP_SWPR_WETH,
    decimals: 18,
    name: 'bSwapr SWPR-WETH',
    symbol: 'bSWLP-SWPR-WETH',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_SWAPR_WETH,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_WBTC_WETH]: {
    address: TOKENS.BARB_SWP_WBTC_WETH,
    decimals: 18,
    name: 'bSwapr WBTC-WETH',
    symbol: 'bSWLP-WBTC-WETH',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_WBTC_WETH,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_BADGER_WETH]: {
    address: TOKENS.BARB_SWP_BADGER_WETH,
    decimals: 18,
    name: 'bSwapr BADGER-WETH',
    symbol: 'bSWLP-BADGER-WETH',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_BADGER_WETH,
      network: Network.Arbitrum,
    },
  },
  [TOKENS.BARB_SWP_IBBTC_WETH]: {
    address: TOKENS.BARB_SWP_IBBTC_WETH,
    decimals: 18,
    name: 'bSwapr ibBTC-WETH',
    symbol: 'bSWLP-IBBTC-WETH',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.ARB_SWP_IBBTC_WETH,
      network: ChainNetwork.Arbitrum,
    },
  },
};
