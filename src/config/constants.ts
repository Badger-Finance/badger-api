import { SwaggerSettings } from '@tsed/swagger';

import { getEnvVar } from './config.utils';
import { Stage } from './enums/stage.enum';

// data access constants
export const YIELD_SNAPSHOTS_DATA = getEnvVar('YIELD_SNAPSHOTS_DATA');
export const VAULT_BALANCES_DATA = getEnvVar('VAULT_BALANCES_DATA');
export const TOKEN_PRICE_DATA = getEnvVar('TOKEN_PRICE_DATA');
export const TOKEN_INFORMATION_DATA = getEnvVar('TOKEN_INFORMATION_DATA');
export const VAULT_SNAPSHOTS_DATA = getEnvVar('VAULT_SNAPSHOTS_DATA');
export const VAULT_DEFINITION_DATA = getEnvVar('VAULT_DEFINITION_DATA');
export const REWARD_DATA = getEnvVar('REWARD_DATA');
export const LEADERBOARD_DATA = getEnvVar('LEADERBOARD_DATA');
export const ACCOUNT_DATA = getEnvVar('ACCOUNT_DATA');
export const METRICS_SNAPSHOTS_DATA = getEnvVar('METRICS_SNAPSHOTS_DATA');
export const LEADERBOARD_SUMMARY_DATA = getEnvVar('LEADERBOARD_SUMMARY_DATA');
export const UNCLAIMED_SNAPSHOTS_DATA = getEnvVar('UNCLAIMED_SNAPSHOTS_DATA');
export const USER_CLAIMED_METADATA = getEnvVar('METADATA_DATA');
export const YIELD_ESTIMATES_DATA = getEnvVar('YIELD_ESTIMATES_DATA');
export const VAULT_YIELD_DATA = getEnvVar('VAULT_YIELD_DATA');
export const PROTOCOL_DATA = getEnvVar('PROTOCOL_DATA');
export const CHART_DATA = getEnvVar('CHART_DATA');
export const GOVERNANCE_PROPOSALS_DATA = getEnvVar('GOVERNANCE_PROPOSALS_DATA');
export const INDEXING_META_DATA = getEnvVar('INDEXING_META_DATA');
export const YIELD_PROJECTIONS_DATA = getEnvVar('YIELD_PROJECTIONS_DATA');

// thegraph constants
export const UNISWAP_URL = getEnvVar('UNISWAP');
export const SUSHISWAP_URL = getEnvVar('SUSHISWAP');
export const SUSHISWAP_MATIC_URL = getEnvVar('SUSHISWAP_MATIC');
export const SUSHISWAP_ARBITRUM_URL = getEnvVar('SUSHISWAP_ARBITRUM');
export const PANCAKESWAP_URL = getEnvVar('PANCAKESWAP');
export const QUICKSWAP_URL = getEnvVar('QUICKSWAP');
export const SWAPR_URL = getEnvVar('SWAPR');
export const BALANCER_URL = getEnvVar('BALANCER');
export const GRAPH_URL = getEnvVar('GRAPH_URL');

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
