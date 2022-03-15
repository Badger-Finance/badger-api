import { SwaggerSettings } from '@tsed/swagger';
import { Stage } from './enums/stage.enum';

// time constants
export const ONE_MINUTE_SECONDS = 60;
export const ONE_MINUTE_MS = ONE_MINUTE_SECONDS * 1000;
export const ONE_DAY_SECONDS = ONE_MINUTE_SECONDS * 60 * 24;
export const ONE_DAY_MS = ONE_DAY_SECONDS * 1000;
export const ONE_YEAR_SECONDS = ONE_DAY_SECONDS * 365;
export const ONE_YEAR_MS = ONE_YEAR_SECONDS * 1000;

// data access constants
export const APY_SNAPSHOTS_DATA = process.env.APY_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const SETT_DATA = process.env.SETT_DATA || 'MISSING REQUIRED ENV VAR';
export const VAULT_BALANCES_DATA = process.env.VAULT_BALANCES_DATA || 'MISSING REQUIRED ENV VAR';
export const PRICE_DATA = process.env.PRICE_DATA || 'MISSING REQUIRED ENV VAR';
export const VAULT_SNAPSHOTS_DATA = process.env.VAULT_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const REWARD_DATA = process.env.REWARD_DATA || 'MISSING REQUIRED ENV VAR';
export const LEADERBOARD_DATA = process.env.LEADERBOARD_DATA || 'MISSING REQUIRED ENV VAR';
export const ACCOUNT_DATA = process.env.ACCOUNT_DATA || 'MISSING REQUIRED ENV VAR';
export const METRICS_SNAPSHOTS_DATA = process.env.METRICS_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const LEADERBOARD_SUMMARY_DATA = process.env.LEADERBOARD_SUMMARY_DATA || 'MISSING REQUIRED ENV VAR';
export const UNCLAIMED_SNAPSHOTS_DATA = process.env.UNCLAIMED_SNAPSHOTS_DATA || 'MISSING REQUIRED ENV VAR';
export const USER_CLAIMED_METADATA = process.env.METADATA_DATA || 'MISSING REQUIRED ENV VAR';

// thegraph constants
export const UNISWAP_URL = process.env.UNISWAP || 'MISSING REQUIRED ENV VAR';
export const SUSHISWAP_URL = process.env.SUSHISWAP || 'MISSING REQUIRED ENV VAR';
export const SUSHISWAP_XDAI_URL = process.env.SUSHISWAP_XDAI || 'MISSING REQUIRED ENV VAR';
export const SUSHISWAP_MATIC_URL = process.env.SUSHISWAP_MATIC || 'MISSING REQUIRED ENV VAR';
export const SUSHISWAP_ARBITRUM_URL = process.env.SUSHISWAP_ARBITRUM || 'MISSING REQUIRED ENV VAR';
export const PANCAKESWAP_URL = process.env.PANCAKESWAP || 'MISSING REQUIRED ENV VAR';
export const QUICKSWAP_URL = process.env.QUICKSWAP || 'MISSING REQUIRED ENV VAR';
export const SWAPR_URL = process.env.SWAPR || 'MISSING REQUIRED ENV VAR';

// general constants
export const STAGE = process.env.STAGE || 'MISSING REQUIRED ENV VAR';
export const IS_OFFLINE = process.env.IS_OFFLINE !== undefined && process.env.IS_OFFLINE === 'true';
export const DEBUG = IS_OFFLINE;
export const API_VERSION = 'v2.0.0';
export const PRODUCTION = STAGE === Stage.Production;

// third party api constants
export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple';
export const BLOCKNATIVE_API_KEY = process.env.BLOCKNATIVE_API_KEY || 'MISSING REQUIRED ENV VAR';

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
