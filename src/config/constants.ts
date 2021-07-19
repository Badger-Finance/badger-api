import { SwaggerSettings } from '@tsed/swagger';
import { ContractRegistry } from './interfaces/contract-registry.interface';
import { checksumEntries } from './util';

const RAW_TOKENS: ContractRegistry = {
  // eth tokens
  BADGER: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
  DIGG: '0x798d1be841a82a273720ce31c822c61a67a601c3',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  XSUSHI: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
  FARM: '0xa0246c9032bC3A600820415aE600c6388619A14D',
  IBBTC: '0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F',
  DEFI_DOLLAR: '0x20c36f062a31865bED8a5B1e512D9a1A20AA333A',
  CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
  CVX: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
  CVXCRV: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7',
  BOR: '0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9',
  PNT: '0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  HBTC: '0x0316EB71485b0Ab14103307bf65a021042c6d380',
  PBTC: '0x5228a22e72ccc52d415ecfd199f99d0665e7733b',
  OBTC: '0x8064d9Ae6cDf087b1bcd5BDf3531bD5d8C537a68',
  BBTC: '0x9be89d2a4cd102d8fecc6bf9da793be995c22541',
  TBTC: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
  RENBTC: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  SBTC: '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
  KEEP: '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC',

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
  CRV_HBTC: '0xb19059ebb43466C323583928285a49f558E572Fd',
  CRV_PBTC: '0xDE5331AC4B3630f94853Ff322B66407e0D6331E8',
  CRV_OBTC: '0x2fE94ea3d5d4a175184081439753DE15AeF9d614',
  CRV_BBTC: '0x410e3E86ef427e30B9235497143881f717d93c2A',
  CRV_TRICRYPTO: '0xcA3d75aC011BF5aD07a98d02f18225F9bD9A6BDF',
  CRV_THREE: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',

  // uniswap tokens
  UNI_BADGER_WBTC: '0xcd7989894bc033581532d2cd88da5db0a4b12859',
  UNI_DIGG_WBTC: '0xe86204c4eddd2f70ee00ead6805f917671f56c52',

  // sushiswap tokens
  SUSHI_ETH_WBTC: '0xceff51756c56ceffca006cd410b03ffc46dd3a58',
  SUSHI_BADGER_WBTC: '0x110492b31c59716ac47337e616804e3e3adc0b4a',
  SUSHI_DIGG_WBTC: '0x9a13867048e01c663ce8ce2fe0cdae69ff9f35e3',
  SUSHI_IBBTC_WBTC: '0x18d98D452072Ac2EB7b74ce3DB723374360539f1',
  SUSHI_CRV_CVXCRV: '0x33F6DDAEa2a8a54062E021873bCaEE006CdF4007',
  SUSHI_CVX_ETH: '0x05767d9EF41dC40689678fFca0608878fb3dE906',

  // pancakeswap tokens
  PANCAKE_BNB_BTCB: '0x61eb789d75a95caa3ff50ed7e47b96c132fec082',
  PANCAKE_OLD_BNB_BTCB: '0x7561EEe90e24F3b348E1087A005F78B4c8453524',
  PANCAKE_BBADGER_BTCB: '0x5A58609dA96469E9dEf3fE344bC39B00d18eb9A5',
  PANCAKE_BDIGG_BTCB: '0x81d776C90c89B8d51E9497D58338933127e2fA80',

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
  BSUSHI_IBBTC_WBTC: '0x8a8FFec8f4A0C8c9585Da95D9D97e8Cd6de273DE',
  BZS_DIGG: '0x608b6D82eb121F3e5C0baeeD32d81007B916E83C',
  BCRV_HBTC: '0x8c76970747afd5398e958bdfada4cf0b9fca16c4',
  BCRV_PBTC: '0x55912d0cf83b75c492e761932abc4db4a5cb1b17',
  BCRV_OBTC: '0xf349c0faa80fc1870306ac093f75934078e28991',
  BCRV_BBTC: '0x5dce29e92b1b939f8e8c60dcf15bde82a85be4a9',
  BCRV_TRICRYPTO: '0xBE08Ef12e4a553666291E9fFC24fCCFd354F2Dd2',
  BCVX: '0x53c8e199eb2cb7c01543c137078a038937a68e40',
  BCVXCRV: '0x2B5455aac8d64C14786c3a29858E43b5945819C0',

  // bsc vault tokens
  BPANCAKE_BNB_BTCB: '0xaf4B9C4b545D5324904bAa15e29796D2E2f90813',
  BPANCAKE_BBADGER_BTCB: '0x857F91f735f4B03b19D2b5c6E476C73DB8241F55',
  BPANCAKE_BDIGG_BTCB: '0xa861Ba302674b08f7F2F24381b705870521DDfed',
};

export const TOKENS = checksumEntries(RAW_TOKENS);

export const RAW_STRATEGIES = {
  BZS_DIGG: '0xA6af1B913E205B8E9B95D3B30768c0989e942316',
};

export const STRATEGIES = checksumEntries(RAW_STRATEGIES);

// data point constants - index two times per hour, 48 per day
export const CURRENT = 0;
export const ONE_DAY = 24 * 2;
export const ONE_MINUTE_MS = 60 * 1000;
export const ONE_DAY_MS = ONE_MINUTE_MS * 60 * 24;
export const THREE_DAYS = ONE_DAY * 3;
export const SEVEN_DAYS = ONE_DAY * 7;
export const THIRTY_DAYS = ONE_DAY * 30;
export const SAMPLE_DAYS = THIRTY_DAYS + 1;
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

// data access constants
export const APY_SNAPSHOTS_DATA = process.env.APY_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const SETT_DATA = process.env.SETT_DATA || 'MISSING REQUIRED ENV VAR';
export const LIQUIDITY_POOL_TOKEN_BALANCES_DATA =
  process.env.LIQUIDITY_POOL_TOKEN_BALANCES_DATA || 'MISSING REQUIRED ENV VAR';
export const PRICE_DATA = process.env.PRICE_DATA || 'MISSING REQUIRED ENV VAR';
export const SETT_SNAPSHOTS_DATA = process.env.SETT_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const REWARD_DATA = process.env.REWARD_DATA || 'MISSING REQUIRED ENV VAR';
export const LEADERBOARD_DATA = process.env.LEADERBOARD_DATA || 'MISSING REQUIRED ENV VAR';
export const ACCOUNT_DATA = process.env.ACCOUNT_DATA || 'MISSING REQUIRED ENV VAR';

// thegraph constants
export const UNISWAP_URL = process.env.UNISWAP || 'MISSING REQUIRED ENV VAR';
export const SUSHISWAP_URL = process.env.SUSHISWAP || 'MISSING REQUIRED ENV VAR';
export const PANCAKESWAP_URL = process.env.PANCAKESWAP || 'MISSING REQUIRED ENV VAR';
export const BADGER_URL = process.env.BADGER || 'MISSING REQUIRED ENV VAR';
export const BADGER_BSC_URL = process.env.BADGER_BSC || 'MISSING REQUIRED ENV VAR';
export const BADGER_DAO_URL = process.env.BADGER_DAO || 'MISSING REQUIRED ENV VAR';
export const MASTERCHEF_URL = process.env.MASTERCHEF || 'MISSING REQUIRED ENV VAR';

// general constants
export const STAGE = process.env.STAGE || 'MISSING REQUIRED ENV VAR';
export const BOUNCER_PROOFS = process.env.BOUNCER_PROOFS || 'MISSING REQUIRED ENV VAR';
export const IS_OFFLINE = process.env.IS_OFFLINE !== undefined && process.env.IS_OFFLINE === 'true';
export const DEBUG = false;
export const API_VERSION = 'v2.0.0';

// third party api constants
export const CURVE_API_URL = 'https://stats.curve.fi/raw-stats/apys.json';
export const CURVE_CRYPTO_API_URL = 'https://stats.curve.fi/raw-stats-crypto/apys.json';
export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple';

export enum Provider {
  Cloudflare = 'https://cloudflare-eth.com/',
  Binance = 'https://bsc-dataseed.binance.org/',
  MyEtherWallet = 'https://nodes.mewapi.io/rpc/eth',
  Alchemy = 'https://eth-mainnet.alchemyapi.io/v2/MnO3SuHlzuCydPWE1XhsYZM_pHZP8_ix',
}
export const SUSHI_CHEF = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';
export const PANCAKE_CHEF = '0x73feaa1eE314F8c655E354234017bE2193C9E24E';
export const BADGER_TREE = '0xbe82A3259ce427B8bCb54b938b486dC2aF509Cc3';

export const swaggerConfig: SwaggerSettings = {
  path: '/docs',
  spec: {
    info: {
      title: 'Badger API',
      description: 'Collection of serverless API to enable public access to data surrounding the Badger protocol.',
      version: API_VERSION,
      contact: {
        name: 'Badger Finance',
        email: 'jintao@badger.finance',
        url: 'https://app.badger.finance/',
      },
    },
    schemes: ['https'],
    host: 'api.badger.finance',
    basePath: '/',
  },
};
