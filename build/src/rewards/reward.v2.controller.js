"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardV2Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const reward_merkle_claim_model_interface_1 = require("./interfaces/reward-merkle-claim-model.interface");
const reward_schedules_vault_model_interface_1 = require("./interfaces/reward-schedules-vault-model.interface");
const reward_schedules_vaults_model_interface_1 = require("./interfaces/reward-schedules-vaults-model.interface");
const rewards_service_1 = require("./rewards.service");
let RewardV2Controller = class RewardV2Controller {
  async getBouncerProof(address, chain) {
    return this.rewardsService.getBouncerProof(chain_config_1.Chain.getChain(chain), address);
  }
  async getBadgerTreeReward(address, chain) {
    return this.rewardsService.getUserRewards(chain_config_1.Chain.getChain(chain), address);
  }
  async getRewardSchedulesVaultsList(chain, active) {
    return this.rewardsService.rewardSchedulesVaultsList(chain_config_1.Chain.getChain(chain), Boolean(active));
  }
  async getRewardListSchedulesForVault(address, chain, active) {
    return this.rewardsService.rewardSchedulesByVault(chain_config_1.Chain.getChain(chain), address, Boolean(active));
  }
};
tslib_1.__decorate(
  [(0, common_1.Inject)(), tslib_1.__metadata("design:type", rewards_service_1.RewardsService)],
  RewardV2Controller.prototype,
  "rewardsService",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Hidden)(),
    (0, common_1.Get)("/bouncer/:address"),
    (0, schema_1.ContentType)("json"),
    tslib_1.__param(0, (0, common_1.PathParams)("address")),
    tslib_1.__param(1, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  RewardV2Controller.prototype,
  "getBouncerProof",
  null
);
tslib_1.__decorate(
  [
    (0, common_1.Get)("/tree/:address"),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get an account's reward proof"),
    (0, schema_1.Description)("Return user badger tree reward proof"),
    (0, schema_1.Returns)(200, reward_merkle_claim_model_interface_1.RewardMerkleClaimModel),
    (0, schema_1.Returns)(404).Description("User has no rewards proof available"),
    tslib_1.__param(0, (0, common_1.PathParams)("address")),
    tslib_1.__param(1, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  RewardV2Controller.prototype,
  "getBadgerTreeReward",
  null
);
tslib_1.__decorate(
  [
    (0, common_1.UseCache)(),
    (0, common_1.Get)("/schedules"),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get all token rewards emmited for all vaults on network"),
    (0, schema_1.Description)("Return emission schedule list for all vaults"),
    (0, schema_1.Returns)(200, reward_schedules_vaults_model_interface_1.RewardSchedulesByVaultsModel),
    tslib_1.__param(0, (0, common_1.QueryParams)("chain")),
    tslib_1.__param(1, (0, common_1.QueryParams)("active")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  RewardV2Controller.prototype,
  "getRewardSchedulesVaultsList",
  null
);
tslib_1.__decorate(
  [
    (0, common_1.UseCache)(),
    (0, common_1.Get)("/schedules/:address"),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get all token rewards emmited for vault on network"),
    (0, schema_1.Description)("Return emission schedule list for specified vault"),
    (0, schema_1.Returns)(200, Array).Of(reward_schedules_vault_model_interface_1.RewardSchedulesByVaultModel),
    (0, schema_1.Returns)(404).Description("Unknown vault"),
    tslib_1.__param(0, (0, common_1.PathParams)("address")),
    tslib_1.__param(1, (0, common_1.QueryParams)("chain")),
    tslib_1.__param(2, (0, common_1.QueryParams)("active")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  RewardV2Controller.prototype,
  "getRewardListSchedulesForVault",
  null
);
RewardV2Controller = tslib_1.__decorate(
  [(0, schema_1.Deprecated)(), (0, common_1.Controller)("/reward")],
  RewardV2Controller
);
exports.RewardV2Controller = RewardV2Controller;
//# sourceMappingURL=reward.v2.controller.js.map
