import { SwaggerSettings } from '@tsed/swagger';

import { getEnvVar } from './config.utils';
import { Stage } from './enums/stage.enum';

// time constants
export const ONE_MINUTE_SECONDS = 60;
export const ONE_DAY_SECONDS = ONE_MINUTE_SECONDS * 60 * 24;
export const ONE_WEEK_SECONDS = ONE_DAY_SECONDS * 7;
export const ONE_YEAR_SECONDS = ONE_DAY_SECONDS * 365;

// data access constants
export const APY_SNAPSHOTS_DATA = getEnvVar('APY_SNAPSHOTS_DATA');
export const SETT_HISTORIC_DATA = getEnvVar('SETT_HISTORIC_DATA');
export const VAULT_BALANCES_DATA = getEnvVar('VAULT_BALANCES_DATA');
export const TOKEN_PRICE_DATA = getEnvVar('TOKEN_PRICE_DATA');
export const TOKEN_INFORMATION_DATA = getEnvVar('TOKEN_INFORMATION_DATA');
export const VAULT_SNAPSHOTS_DATA = getEnvVar('VAULT_SNAPSHOTS_DATA');
export const VAULT_COMPOUND_DATA = getEnvVar('VAULT_COMPOUND_DATA');
export const REWARD_DATA = getEnvVar('REWARD_DATA');
export const LEADERBOARD_DATA = getEnvVar('LEADERBOARD_DATA');
export const ACCOUNT_DATA = getEnvVar('ACCOUNT_DATA');
export const METRICS_SNAPSHOTS_DATA = getEnvVar('METRICS_SNAPSHOTS_DATA');
export const LEADERBOARD_SUMMARY_DATA = getEnvVar('LEADERBOARD_SUMMARY_DATA');
export const UNCLAIMED_SNAPSHOTS_DATA = getEnvVar('UNCLAIMED_SNAPSHOTS_DATA');
export const USER_CLAIMED_METADATA = getEnvVar('METADATA_DATA');
export const HARVEST_DATA = getEnvVar('HARVEST_DATA');
export const HARVEST_COMPOUND_DATA = getEnvVar('HARVEST_COMPOUND_DATA');
export const TREASURY_SNAPSHOT_DATA = getEnvVar('TREASURY_SNAPSHOT_DATA');
export const PROTOCOL_DATA = getEnvVar('PROTOCOL_DATA');
export const CHART_DATA = getEnvVar('CHART_DATA');
export const CITADEL_REWARDS_DATA = getEnvVar('CITADEL_REWARDS_DATA');
export const MIGRATION_PROCESS_DATA = getEnvVar('MIGRATION_PROCESS_DATA');

// thegraph constants
export const UNISWAP_URL = getEnvVar('UNISWAP');
export const SUSHISWAP_URL = getEnvVar('SUSHISWAP');
export const SUSHISWAP_MATIC_URL = getEnvVar('SUSHISWAP_MATIC');
export const SUSHISWAP_ARBITRUM_URL = getEnvVar('SUSHISWAP_ARBITRUM');
export const PANCAKESWAP_URL = getEnvVar('PANCAKESWAP');
export const QUICKSWAP_URL = getEnvVar('QUICKSWAP');
export const SWAPR_URL = getEnvVar('SWAPR');

// general constants
export const STAGE = getEnvVar('STAGE');
export const API_VERSION = 'v2.0.0';
export const PRODUCTION = STAGE === Stage.Production;
export const DISCORD_WEBHOOK_URL = getEnvVar('DISCORD_WEBHOOK_URL');

export const DEFAULT_PAGE_SIZE = 20;

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
        url: 'https://app.badger.com/',
      },
    },
    schemes: ['https'],
    host: 'api.badger.com',
    basePath: '/',
  },
};
