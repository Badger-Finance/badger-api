import { TOKENS } from '../../config/constants';
import { Token } from '../../interface/Token';
import { getContractPrice, getTokenPrice } from '../../prices/PricesService';
import { getSushiswapPrice, getUniswapPrice } from '../../protocols/common/swap-util';

const badger: Token = {
  address: TOKENS.BADGER,
  name: 'Badger',
  symbol: 'BADGER',
  decimals: 18,
  price: () => getContractPrice(TOKENS.BADGER),
};

const digg: Token = {
  address: TOKENS.DIGG,
  name: 'Digg',
  symbol: 'DIGG',
  decimals: 9,
  price: () => getContractPrice(TOKENS.DIGG),
};

const sushiWbtcDigg: Token = {
  address: TOKENS.SUSHI_DIGG_WBTC,
  name: 'SushiSwap: WBTC-DIGG',
  symbol: 'SushiSwap WBTC/DIGG LP (SLP)',
  decimals: 18,
  price: () => getSushiswapPrice(TOKENS.SUSHI_DIGG_WBTC),
};

const sushiBagderDigg: Token = {
  address: TOKENS.SUSHI_BADGER_WBTC,
  name: 'SushiSwap: WBTC-BADGER',
  symbol: 'Badger Sett SushiSwap LP Token (bSLP)',
  decimals: 18,
  price: () => getSushiswapPrice(TOKENS.SUSHI_BADGER_WBTC),
};

const sushiWbtcEth: Token = {
  address: TOKENS.SUSHI_ETH_WBTC,
  name: 'SushiSwap: WBTC-ETH',
  symbol: 'SushiSwap WBTC/ETH LP (SLP)',
  decimals: 18,
  price: () => getSushiswapPrice(TOKENS.SUSHI_ETH_WBTC),
};

const uniWbtcDigg: Token = {
  address: TOKENS.UNI_DIGG_WBTC,
  name: 'Uniswap V2: WBTC-DIGG',
  symbol: 'Uniswap WBTC/DIGG LP (UNI-V2)',
  decimals: 18,
  price: () => getUniswapPrice(TOKENS.UNI_DIGG_WBTC),
};

const uniBagderDigg: Token = {
  address: TOKENS.UNI_BADGER_WBTC,
  name: 'Uniswap V2: WBTC-BADGER',
  symbol: 'Uniswap WBTC/BADGER LP (UNI-V2)',
  decimals: 18,
  price: () => getUniswapPrice(TOKENS.UNI_BADGER_WBTC),
};

const crvRenBtc: Token = {
  address: TOKENS.CRV_RENBTC,
  name: 'Curve.fi: renCrv Token',
  symbol: 'Curve.fi renBTC/wBTC (crvRenWBTC)',
  decimals: 18,
  price: () => getTokenPrice(TOKENS.WBTC),
};

const crvTbtc: Token = {
  address: TOKENS.CRV_TBTC,
  name: 'Curve.fi tBTC/sbtcCrv',
  symbol: 'Curve.fi tBTC/sbtcCrv (tbtc/sbtc)',
  decimals: 18,
  price: () => getTokenPrice(TOKENS.WBTC),
};

const crvSbtc: Token = {
  address: TOKENS.CRV_SBTC,
  name: 'Curve.fi renBTC/wBTC/sBTC',
  symbol: 'Curve.fi renBTC/wBTC/sBTC',
  decimals: 18,
  price: () => getTokenPrice(TOKENS.WBTC),
};

export const ethTokens = [
  badger,
  digg,
  sushiWbtcDigg,
  sushiBagderDigg,
  sushiWbtcEth,
  uniWbtcDigg,
  uniBagderDigg,
  crvRenBtc,
  crvTbtc,
  crvSbtc,
];
