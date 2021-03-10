import { ethers } from 'ethers';

const RAW_TOKENS = {
  // general tokens
  BADGER: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
  DIGG: '0x798d1be841a82a273720ce31c822c61a67a601c3',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  BTCB: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  BSC_BBADGER: '0x1F7216fdB338247512Ec99715587bb97BBf96eae',
  BSC_BDIGG: '0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA',

  // curve tokens
  CRV_RENBTC: '0x49849c98ae39fff122806c06791fa73784fb3675',
  CRV_TBTC: '0x64eda51d3ad40d56b9dfc5554e06f94e1dd786fd',
  CRV_SBTC: '0x075b1bb99792c9e1041ba13afef80c91a1e70fb3',

  // uniswap tokens
  UNI_BADGER_WBTC: '0xcd7989894bc033581532d2cd88da5db0a4b12859',
  UNI_DIGG_WBTC: '0xe86204c4eddd2f70ee00ead6805f917671f56c52',

  // sushiswap tokens
  SUSHI_ETH_WBTC: '0xceff51756c56ceffca006cd410b03ffc46dd3a58',
  SUSHI_BADGER_WBTC: '0x110492b31c59716ac47337e616804e3e3adc0b4a',
  SUSHI_DIGG_WBTC: '0x9a13867048e01c663ce8ce2fe0cdae69ff9f35e3',

  // pancakeswap tokens
  PANCAKE_BNB_BTCB: '0x7561EEe90e24F3b348E1087A005F78B4c8453524',
  PANCAKE_BBADGER_BTCB: '0x10F461CEAC7A17F59e249954Db0784d42EfF5DB5',
  PANCAKE_BDIGG_BTCB: '0xE1E33459505bB3763843a426F7Fd9933418184ae',
};
export const TOKENS = Object.fromEntries(
  Object.entries(RAW_TOKENS).map(([key, val]) => [key, ethers.utils.getAddress(val)]),
);

export enum Protocol {
  Curve = 'curve',
  Sushiswap = 'sushiswap',
  Uniswap = 'uniswap',
  Pancakeswap = 'pancakeswap',
}

export enum Protocol {
	Curve = 'curve',
	Sushiswap = 'sushiswap',
	Uniswap = 'uniswap',
	Pancakeswap = 'pancakeswap',
}

// data point constants - index two times per hour, 48 per day
export const CURRENT = 0;
export const ONE_DAY = 24 * 2;
export const THREE_DAYS = ONE_DAY * 3;
export const SEVEN_DAYS = ONE_DAY * 7;
export const THIRTY_DAYS = ONE_DAY * 30;
export const SAMPLE_DAYS = THIRTY_DAYS + 1;
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export const BLOCKS_PER_YEAR = 2425847;
export const BSC_BLOCKS_PER_YEAR = 10512000;

// data access constants
export const ASSET_DATA = process.env.ASSET_DATA || 'MISSING REQUIRED ENV VAR';
export const PRICE_DATA = process.env.PRICE_DATA || 'MISSING REQUIRED ENV VAR';
export const UNISWAP_URL = process.env.UNISWAP || 'MISSING REQUIRED ENV VAR';
export const SUSHISWAP_URL = process.env.SUSHISWAP || 'MISSING REQUIRED ENV VAR';
export const PANCAKESWAP_URL = process.env.PANCAKESWAP || 'MISSING REQUIRED ENV VAR';
export const BADGER_URL = process.env.BADGER || 'MISSING REQUIRED ENV VAR';
export const BADGER_DAO_SUBGRAPH_URL = process.env.BADGER_DAO_SUBGRAPH_URL || 'MISSING REQUIRED ENV VAR';
export const MASTERCHEF_URL = process.env.MASTERCHEF || 'MISSING REQUIRED ENV VAR';
export const MERKLE_CLAIM_BUCKET = process.env.MERKLE_CLAIM_BUCKET || 'MISSING REQUIRED ENV VAR';

// third party api constants
export const CURVE_API_URL = 'https://stats.curve.fi/raw-stats/apys.json';
export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple';

export enum Provider {
  Cloudflare = 'https://cloudflare-eth.com/',
  Binance = 'https://bsc-dataseed.binance.org/',
}
export const SUSHI_CHEF = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';
export const PANCAKE_CHEF = '0x73feaa1eE314F8c655E354234017bE2193C9E24E';
