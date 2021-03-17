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
  [TOKENS.CRV_RENBTC]: {
    address: TOKENS.CRV_RENBTC,
    decimals: 18,
    name: 'Curve.fi: renCrv Token',
    symbol: 'Curve.fi renBTC/wBTC (crvRenWBTC)',
    type: TokenType.Contract,
    lpToken: true,
  },
  [TOKENS.CRV_SBTC]: {
    address: TOKENS.CRV_SBTC,
    decimals: 18,
    name: 'Curve.fi renBTC/wBTC/sBTC',
    symbol: 'Curve.fi renBTC/wBTC/sBTC',
    type: TokenType.Contract,
    lpToken: true,
  },
  [TOKENS.CRV_TBTC]: {
    address: TOKENS.CRV_TBTC,
    decimals: 18,
    name: 'Curve.fi tBTC/sbtcCrv',
    symbol: 'Curve.fi tBTC/sbtcCrv (tbtc/sbtc)',
    type: TokenType.Contract,
    lpToken: true,
  },
  [TOKENS.DIGG]: {
    address: TOKENS.DIGG,
    decimals: 9,
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
  [TOKENS.SUSHI_BADGER_WBTC]: {
    address: TOKENS.SUSHI_BADGER_WBTC,
    decimals: 18,
    name: 'SushiSwap: WBTC-BADGER',
    symbol: 'Badger Sett SushiSwap LP Token (bSLP)',
    type: TokenType.SushiswapLp,
    lpToken: true,
  },
  [TOKENS.SUSHI_DIGG_WBTC]: {
    address: TOKENS.SUSHI_DIGG_WBTC,
    decimals: 18,
    name: 'SushiSwap: WBTC-DIGG',
    symbol: 'SushiSwap WBTC/DIGG LP (SLP)',
    type: TokenType.SushiswapLp,
    lpToken: true,
  },
  [TOKENS.SUSHI_ETH_WBTC]: {
    address: TOKENS.SUSHI_ETH_WBTC,
    decimals: 18,
    name: 'SushiSwap: WBTC-ETH',
    symbol: 'SushiSwap WBTC/ETH LP (SLP)',
    type: TokenType.SushiswapLp,
    lpToken: true,
  },
  [TOKENS.UNI_BADGER_WBTC]: {
    address: TOKENS.UNI_BADGER_WBTC,
    decimals: 18,
    name: 'Uniswap V2: WBTC-BADGER',
    symbol: 'Uniswap WBTC/BADGER LP (UNI-V2)',
    type: TokenType.UniswapLp,
    lpToken: true,
  },
  [TOKENS.UNI_DIGG_WBTC]: {
    address: TOKENS.UNI_DIGG_WBTC,
    decimals: 18,
    name: 'Uniswap V2: WBTC-DIGG',
    symbol: 'Uniswap WBTC/DIGG LP (UNI-V2)',
    type: TokenType.UniswapLp,
    lpToken: true,
  },
};
