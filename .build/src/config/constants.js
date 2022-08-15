"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig =
  exports.DEFAULT_PAGE_SIZE =
  exports.DISCORD_WEBHOOK_URL =
  exports.PRODUCTION =
  exports.API_VERSION =
  exports.STAGE =
  exports.BALANCER_URL =
  exports.SWAPR_URL =
  exports.QUICKSWAP_URL =
  exports.PANCAKESWAP_URL =
  exports.SUSHISWAP_ARBITRUM_URL =
  exports.SUSHISWAP_MATIC_URL =
  exports.SUSHISWAP_URL =
  exports.UNISWAP_URL =
  exports.CHART_DATA =
  exports.PROTOCOL_DATA =
  exports.HARVEST_COMPOUND_DATA =
  exports.YIELD_ESTIMATES_DATA =
  exports.USER_CLAIMED_METADATA =
  exports.UNCLAIMED_SNAPSHOTS_DATA =
  exports.LEADERBOARD_SUMMARY_DATA =
  exports.METRICS_SNAPSHOTS_DATA =
  exports.ACCOUNT_DATA =
  exports.LEADERBOARD_DATA =
  exports.REWARD_DATA =
  exports.VAULT_DEFINITION_DATA =
  exports.VAULT_SNAPSHOTS_DATA =
  exports.TOKEN_INFORMATION_DATA =
  exports.TOKEN_PRICE_DATA =
  exports.VAULT_BALANCES_DATA =
  exports.YIELD_SNAPSHOTS_DATA =
  exports.ONE_YEAR_SECONDS =
  exports.ONE_WEEK_SECONDS =
  exports.ONE_DAY_SECONDS =
  exports.ONE_MINUTE_SECONDS =
    void 0;
const config_utils_1 = require("./config.utils");
const stage_enum_1 = require("./enums/stage.enum");
// time constants
exports.ONE_MINUTE_SECONDS = 60;
exports.ONE_DAY_SECONDS = exports.ONE_MINUTE_SECONDS * 60 * 24;
exports.ONE_WEEK_SECONDS = exports.ONE_DAY_SECONDS * 7;
exports.ONE_YEAR_SECONDS = exports.ONE_DAY_SECONDS * 365;
// data access constants
exports.YIELD_SNAPSHOTS_DATA = (0, config_utils_1.getEnvVar)("YIELD_SNAPSHOTS_DATA");
exports.VAULT_BALANCES_DATA = (0, config_utils_1.getEnvVar)("VAULT_BALANCES_DATA");
exports.TOKEN_PRICE_DATA = (0, config_utils_1.getEnvVar)("TOKEN_PRICE_DATA");
exports.TOKEN_INFORMATION_DATA = (0, config_utils_1.getEnvVar)("TOKEN_INFORMATION_DATA");
exports.VAULT_SNAPSHOTS_DATA = (0, config_utils_1.getEnvVar)("VAULT_SNAPSHOTS_DATA");
exports.VAULT_DEFINITION_DATA = (0, config_utils_1.getEnvVar)("VAULT_DEFINITION_DATA");
exports.REWARD_DATA = (0, config_utils_1.getEnvVar)("REWARD_DATA");
exports.LEADERBOARD_DATA = (0, config_utils_1.getEnvVar)("LEADERBOARD_DATA");
exports.ACCOUNT_DATA = (0, config_utils_1.getEnvVar)("ACCOUNT_DATA");
exports.METRICS_SNAPSHOTS_DATA = (0, config_utils_1.getEnvVar)("METRICS_SNAPSHOTS_DATA");
exports.LEADERBOARD_SUMMARY_DATA = (0, config_utils_1.getEnvVar)("LEADERBOARD_SUMMARY_DATA");
exports.UNCLAIMED_SNAPSHOTS_DATA = (0, config_utils_1.getEnvVar)("UNCLAIMED_SNAPSHOTS_DATA");
exports.USER_CLAIMED_METADATA = (0, config_utils_1.getEnvVar)("METADATA_DATA");
exports.YIELD_ESTIMATES_DATA = (0, config_utils_1.getEnvVar)("YIELD_ESTIMATES_DATA");
exports.HARVEST_COMPOUND_DATA = (0, config_utils_1.getEnvVar)("HARVEST_COMPOUND_DATA");
exports.PROTOCOL_DATA = (0, config_utils_1.getEnvVar)("PROTOCOL_DATA");
exports.CHART_DATA = (0, config_utils_1.getEnvVar)("CHART_DATA");
// thegraph constants
exports.UNISWAP_URL = (0, config_utils_1.getEnvVar)("UNISWAP");
exports.SUSHISWAP_URL = (0, config_utils_1.getEnvVar)("SUSHISWAP");
exports.SUSHISWAP_MATIC_URL = (0, config_utils_1.getEnvVar)("SUSHISWAP_MATIC");
exports.SUSHISWAP_ARBITRUM_URL = (0, config_utils_1.getEnvVar)("SUSHISWAP_ARBITRUM");
exports.PANCAKESWAP_URL = (0, config_utils_1.getEnvVar)("PANCAKESWAP");
exports.QUICKSWAP_URL = (0, config_utils_1.getEnvVar)("QUICKSWAP");
exports.SWAPR_URL = (0, config_utils_1.getEnvVar)("SWAPR");
exports.BALANCER_URL = (0, config_utils_1.getEnvVar)("BALANCER");
// general constants
exports.STAGE = (0, config_utils_1.getEnvVar)("STAGE");
exports.API_VERSION = "v2.0.0";
exports.PRODUCTION = exports.STAGE === stage_enum_1.Stage.Production;
exports.DISCORD_WEBHOOK_URL = (0, config_utils_1.getEnvVar)("DISCORD_WEBHOOK_URL");
exports.DEFAULT_PAGE_SIZE = 20;
exports.swaggerConfig = {
  path: "/docs",
  spec: {
    info: {
      title: "Badger API",
      description: "Collection of serverless API to enable public access to data surrounding the Badger protocol.",
      version: exports.API_VERSION,
      contact: {
        name: "Badger Finance",
        email: "jintao@badger.finance",
        url: "https://app.badger.com/"
      }
    },
    schemes: ["https"],
    host: "api.badger.com",
    basePath: "/"
  }
};
//# sourceMappingURL=constants.js.map
