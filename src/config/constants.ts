import { ethers } from 'ethers';

const RAW_TOKENS = {
  // eth tokens
  BADGER: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
  DIGG: '0x798d1be841a82a273720ce31c822c61a67a601c3',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',

  // bsc tokens
  CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  BTCB: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  BSC_BADGER: '0x753fbc5800a8C8e3Fb6DC6415810d627A387Dfc9',
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
  PANCAKE_BNB_BTCB: '0x356b7d0d3c54F22C82B7a670C6Ba9E2381b0624c',
  PANCAKE_BBADGER_BTCB: '0x87Ae7b5c43D4e160cDB9427a78BA87B9503ee37b',
  PANCAKE_BDIGG_BTCB: '0xfbfa92e037e37F946c0105902640914E3aCe6752',

  // eth vault tokens
  BBADGER: '0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28',
  BDIGG: '0x7e7e112a68d8d2e221e11047a72ffc1065c38e1a',
  BUNI_BADGER_WBTC: '0x235c9e24d3fb2fafd58a2e49d454fdcd2dbf7ff1',
  BUNI_DIGG_WBTC: '0xc17078fdd324cc473f8175dc5290fae5f2e84714',
  BSUSHI_ETH_WBTC: '0x758a43ee2bff8230eeb784879cdcff4828f2544d',
  BSUSHI_BADGER_WBTC: '0x1862a18181346ebd9edaf800804f89190def24a5',
  BSUSHI_DIGG_WBTC: '0x88128580acdd9c04ce47afce196875747bf2a9f6',
  BCRV_SBTC: '0xd04c48a53c111300ad41190d63681ed3dad998ec',
  BCRV_RENBTC: '0x6def55d2e18486b9ddfaa075bc4e4ee0b28c1545',
  BCRV_TBTC: '0xb9d076fde463dbc9f915e5392f807315bf940334',
  BCRV_HRENBTC: '0xaf5a1decfa95baf63e0084a35c62592b774a2a87',
  BVYWBTC: '0x4b92d19c11435614cd49af1b589001b7c08cd4d5',

  // bsc vault tokens
  BPANCAKE_BNB_BTCB: '0xaf4B9C4b545D5324904bAa15e29796D2E2f90813',
  BPANCAKE_BBADGER_BTCB: '0x857F91f735f4B03b19D2b5c6E476C73DB8241F55',
  BPANCAKE_BDIGG_BTCB: '0xa861Ba302674b08f7F2F24381b705870521DDfed',
};

export const TOKENS = Object.fromEntries(
  Object.entries(RAW_TOKENS).map(([key, val]) => [key, ethers.utils.getAddress(val)]),
);

export enum Protocol {
  Curve = 'curve',
  Sushiswap = 'sushiswap',
  Uniswap = 'uniswap',
  Pancakeswap = 'pancakeswap',
  Yearn = 'yearn',
}

// data point constants - index two times per hour, 48 per day
export const CURRENT = 0;
export const ONE_DAY = 24 * 2;
export const ONE_MINUTE_MS = 60 * 1000;
export const THREE_DAYS = ONE_DAY * 3;
export const SEVEN_DAYS = ONE_DAY * 7;
export const THIRTY_DAYS = ONE_DAY * 30;
export const SAMPLE_DAYS = THIRTY_DAYS + 1;
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// data access constants
export const APY_SNAPSHOTS_DATA = process.env.APY_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const ASSET_DATA = process.env.ASSET_DATA || 'MISSING REQUIRED ENV VAR';
export const PRICE_DATA = process.env.PRICE_DATA || 'MISSING REQUIRED ENV VAR';
export const SETT_SNAPSHOTS_DATA = process.env.SETT_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const REWARD_DATA = process.env.REWARD_DATA || 'MISSING REQUIRED ENV VAR';
export const UNISWAP_URL = process.env.UNISWAP || 'MISSING REQUIRED ENV VAR';
export const SUSHISWAP_URL = process.env.SUSHISWAP || 'MISSING REQUIRED ENV VAR';
export const PANCAKESWAP_URL = process.env.PANCAKESWAP || 'MISSING REQUIRED ENV VAR';
export const BADGER_URL = process.env.BADGER || 'MISSING REQUIRED ENV VAR';
export const BADGER_BSC_URL = process.env.BADGER_BSC || 'MISSING REQUIRED ENV VAR';
export const BADGER_DAO_URL = process.env.BADGER_DAO || 'MISSING REQUIRED ENV VAR';
export const MASTERCHEF_URL = process.env.MASTERCHEF || 'MISSING REQUIRED ENV VAR';
export const BOUNCER_PROOFS = process.env.BOUNCER_PROOFS || 'MISSING REQUIRED ENV VAR';

// third party api constants
export const CURVE_API_URL = 'https://stats.curve.fi/raw-stats/apys.json';
export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple';

export enum Provider {
  Cloudflare = 'https://cloudflare-eth.com/',
  Binance = 'https://bsc-dataseed.binance.org/',
  MyEtherWallet = 'https://nodes.mewapi.io/rpc/eth',
}
export const SUSHI_CHEF = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';
export const PANCAKE_CHEF = '0x73feaa1eE314F8c655E354234017bE2193C9E24E';
