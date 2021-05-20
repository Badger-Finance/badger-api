import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { TOKENS } from '../../config/constants';
import { TokenType } from '../enums/token-type.enum';
import { TokenConfig } from '../types/token-config.type';

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
  [TOKENS.CRV_RENBTC]: {
    address: TOKENS.CRV_RENBTC,
    decimals: 18,
    lookupName: 'wrapped-bitcoin',
    name: 'Curve.fi: renCrv Token',
    symbol: 'Curve.fi renBTC/wBTC (crvRenWBTC)',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_SBTC]: {
    address: TOKENS.CRV_SBTC,
    decimals: 18,
    lookupName: 'sbtc',
    name: 'Curve.fi renBTC/wBTC/sBTC',
    symbol: 'Curve.fi renBTC/wBTC/sBTC',
    type: TokenType.Contract,
  },
  [TOKENS.CRV_TBTC]: {
    address: TOKENS.CRV_TBTC,
    decimals: 18,
    lookupName: 'tbtc',
    name: 'Curve.fi tBTC/sbtcCrv',
    symbol: 'Curve.fi tBTC/sbtcCrv (tbtc/sbtc)',
    type: TokenType.Contract,
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
    name: 'ibBTC',
    symbol: 'bBTC',
    type: TokenType.Index,
  },
  [TOKENS.SUSHI_BADGER_WBTC]: {
    address: TOKENS.SUSHI_BADGER_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'SushiSwap: WBTC-BADGER',
    symbol: 'Badger Sett SushiSwap LP Token (bSLP)',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.SUSHI_DIGG_WBTC]: {
    address: TOKENS.SUSHI_DIGG_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'SushiSwap: WBTC-DIGG',
    symbol: 'SushiSwap WBTC/DIGG LP (SLP)',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.SUSHI_ETH_WBTC]: {
    address: TOKENS.SUSHI_ETH_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'SushiSwap: WBTC-ETH',
    symbol: 'SushiSwap WBTC/ETH LP (SLP)',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.SUSHI_IBBTC_WBTC]: {
    address: TOKENS.SUSHI_IBBTC_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'SushiSwap: ibBTC-WBTC',
    symbol: 'SushiSwap ibBTC/WBTC LP (SLP)',
    type: TokenType.SushiswapLp,
  },
  [TOKENS.UNI_BADGER_WBTC]: {
    address: TOKENS.UNI_BADGER_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Uniswap V2: WBTC-BADGER',
    symbol: 'Uniswap WBTC/BADGER LP (UNI-V2)',
    type: TokenType.UniswapLp,
  },
  [TOKENS.UNI_DIGG_WBTC]: {
    address: TOKENS.UNI_DIGG_WBTC,
    decimals: 18,
    lpToken: true,
    name: 'Uniswap V2: WBTC-DIGG',
    symbol: 'Uniswap WBTC/DIGG LP (UNI-V2)',
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
    symbol: 'bSLP-BADGER-ETH',
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
    symbol: 'bSLP-DIGG-ETH',
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
    symbol: 'brenBTCCRV',
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
    symbol: 'bsBTCCRV',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_SBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_TBTC]: {
    address: TOKENS.BCRV_TBTC,
    decimals: 18,
    name: 'bCurve.fi tBTC/sbtcCrv',
    symbol: 'btBTCCRV',
    type: TokenType.Vault,
    vaultToken: {
      address: TOKENS.CRV_TBTC,
      network: ChainNetwork.Ethereum,
    },
  },
  [TOKENS.BCRV_HRENBTC]: {
    address: TOKENS.BCRV_HRENBTC,
    decimals: 18,
    name: 'bHarvest Curve.fi crvRenWBTC',
    symbol: 'bhrenBTCCRV',
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
};
