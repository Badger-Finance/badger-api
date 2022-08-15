"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardSchedulesByVaultModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const reward_schedules_vaults_mock_1 = require("../examples/reward-schedules-vaults.mock");
let RewardSchedulesByVaultModel = class RewardSchedulesByVaultModel {
  constructor(rewardSchedulesResp) {
    this.beneficiary = rewardSchedulesResp.beneficiary;
    this.token = rewardSchedulesResp.token;
    this.amount = rewardSchedulesResp.amount;
    this.start = rewardSchedulesResp.start;
    this.end = rewardSchedulesResp.end;
    this.compPercent = rewardSchedulesResp.compPercent;
  }
};
tslib_1.__decorate(
  [
    (0, schema_1.Title)("beneficiary"),
    (0, schema_1.Description)("To whom token emmited"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  RewardSchedulesByVaultModel.prototype,
  "beneficiary",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("token"),
    (0, schema_1.Description)("Token addr"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  RewardSchedulesByVaultModel.prototype,
  "token",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("amount"),
    (0, schema_1.Description)("Total amount of emmited token"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  RewardSchedulesByVaultModel.prototype,
  "amount",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("start"),
    (0, schema_1.Description)("Schedule start timestamp"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  RewardSchedulesByVaultModel.prototype,
  "start",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("end"),
    (0, schema_1.Description)("Schedule end timestamp"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  RewardSchedulesByVaultModel.prototype,
  "end",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("compPercent"),
    (0, schema_1.Description)("Percent of schedule completion"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  RewardSchedulesByVaultModel.prototype,
  "compPercent",
  void 0
);
RewardSchedulesByVaultModel = tslib_1.__decorate(
  [
    (0, schema_1.Description)("Rewards schedules by vaults map"),
    (0, schema_1.Example)(
      reward_schedules_vaults_mock_1.rewardSchedules[reward_schedules_vaults_mock_1.firstVaultAddr]
    ),
    tslib_1.__metadata("design:paramtypes", [Object])
  ],
  RewardSchedulesByVaultModel
);
exports.RewardSchedulesByVaultModel = RewardSchedulesByVaultModel;
//# sourceMappingURL=reward-schedules-vault-model.interface.js.map
