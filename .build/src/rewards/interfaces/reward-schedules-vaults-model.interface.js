"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardSchedulesByVaultsModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const reward_schedules_vaults_mock_1 = require("../examples/reward-schedules-vaults.mock");
let RewardSchedulesByVaultsModel = class RewardSchedulesByVaultsModel {};
RewardSchedulesByVaultsModel = tslib_1.__decorate(
  [
    (0, schema_1.Description)("Rewards schedules by vaults map"),
    (0, schema_1.Example)(reward_schedules_vaults_mock_1.rewardSchedules)
  ],
  RewardSchedulesByVaultsModel
);
exports.RewardSchedulesByVaultsModel = RewardSchedulesByVaultsModel;
//# sourceMappingURL=reward-schedules-vaults-model.interface.js.map
