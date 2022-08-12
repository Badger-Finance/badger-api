"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V3_CONTROLLERS = exports.V2_CONTROLLERS = void 0;
const account_v3_controller_1 = require("./accounts/account.v3.controller");
const accounts_v2_controller_1 = require("./accounts/accounts.v2.controller");
const charts_controller_1 = require("./charts/charts.controller");
const dev_controller_1 = require("./dev/dev.controller");
const gas_controller_1 = require("./gas/gas.controller");
const leaderboards_controller_1 = require("./leaderboards/leaderboards.controller");
const metrics_controller_1 = require("./metrics/metrics.controller");
const prices_controller_1 = require("./prices/prices.controller");
const proof_v3_controller_1 = require("./proofs/proof.v3.controller");
const proofs_v2_controller_1 = require("./proofs/proofs.v2.controller");
const protocols_controller_1 = require("./protocols/protocols.controller");
const reward_v2_controller_1 = require("./rewards/reward.v2.controller");
const rewards_v2_controller_1 = require("./rewards/rewards.v2.controller");
const rewards_v3_controller_1 = require("./rewards/rewards.v3.controller");
const tokens_controller_1 = require("./tokens/tokens.controller");
const vaults_v2_controller_1 = require("./vaults/vaults.v2.controller");
const vaults_v3_controller_1 = require("./vaults/vaults.v3.controller");
/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
exports.V2_CONTROLLERS = [
    charts_controller_1.ChartsController,
    gas_controller_1.GasController,
    leaderboards_controller_1.LeaderBoardsController,
    metrics_controller_1.MetricsController,
    protocols_controller_1.ProtocolController,
    prices_controller_1.PriceController,
    tokens_controller_1.TokensController,
    accounts_v2_controller_1.AccountsV2Controller,
    proofs_v2_controller_1.ProofsV2Controller,
    reward_v2_controller_1.RewardV2Controller,
    rewards_v2_controller_1.RewardsV2Controller,
    vaults_v2_controller_1.VaultsV2Controller,
];
exports.V3_CONTROLLERS = [
    charts_controller_1.ChartsController,
    gas_controller_1.GasController,
    leaderboards_controller_1.LeaderBoardsController,
    metrics_controller_1.MetricsController,
    prices_controller_1.PriceController,
    tokens_controller_1.TokensController,
    dev_controller_1.DevelopmentController,
    account_v3_controller_1.AccountV3Controller,
    proof_v3_controller_1.ProofsV3Controller,
    rewards_v3_controller_1.RewardsV3Controller,
    vaults_v3_controller_1.VaultsV3Controller,
];
//# sourceMappingURL=ControllerRegistry.js.map