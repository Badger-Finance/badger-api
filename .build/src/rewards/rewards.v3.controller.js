"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsV3Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const ethers_1 = require("ethers");
const chain_config_1 = require("../chains/config/chain.config");
const constants_1 = require("../config/constants");
const tokens_config_1 = require("../config/tokens.config");
const query_param_error_1 = require("../errors/validation/query.param.error");
const tokens_utils_1 = require("../tokens/tokens.utils");
const reward_merkle_claim_model_interface_1 = require("./interfaces/reward-merkle-claim-model.interface");
const reward_schedules_vault_model_interface_1 = require("./interfaces/reward-schedules-vault-model.interface");
const reward_schedules_vaults_model_interface_1 = require("./interfaces/reward-schedules-vaults-model.interface");
const rewards_service_1 = require("./rewards.service");
const rewards_utils_1 = require("./rewards.utils");
let RewardsV3Controller = class RewardsV3Controller {
    async getBouncerProof(address, chain) {
        if (!address)
            throw new query_param_error_1.QueryParamError('address');
        return this.rewardsService.getBouncerProof(chain_config_1.Chain.getChain(chain), ethers_1.ethers.utils.getAddress(address));
    }
    async list(chainId, pageNum, pageCount) {
        const chain = chain_config_1.Chain.getChainById(chainId);
        const { count, records } = await this.rewardsService.list({ chain, pageNum, pageCount });
        return {
            total_count: count,
            total_page_num: Math.ceil(count / (pageCount || constants_1.DEFAULT_PAGE_SIZE)),
            users: await Promise.all(records.map((record) => this.userClaimedSnapshotToDebankUser(chain, record))),
        };
    }
    async userClaimedSnapshotToDebankUser(chain, snapshot) {
        const rewards = {};
        for (const record of snapshot.claimableBalances) {
            const { address, balance } = record;
            const token = await (0, tokens_utils_1.getFullToken)(chain, address);
            if (token.address === tokens_config_1.TOKENS.DIGG) {
                rewards[address] = (0, sdk_1.formatBalance)(ethers_1.BigNumber.from(balance).div(rewards_utils_1.DIGG_SHARE_PER_FRAGMENT), token.decimals);
            }
            else {
                rewards[address] = (0, sdk_1.formatBalance)(balance, token.decimals);
            }
        }
        return {
            user_addr: snapshot.address,
            rewards,
        };
    }
    async getBadgerTreeReward(address, chain) {
        if (!address)
            throw new query_param_error_1.QueryParamError('address');
        return this.rewardsService.getUserRewards(chain_config_1.Chain.getChain(chain), ethers_1.ethers.utils.getAddress(address));
    }
    async getRewardListSchedulesForVault(address, chain, active) {
        if (!address)
            throw new query_param_error_1.QueryParamError('address');
        return this.rewardsService.rewardSchedulesByVault(chain_config_1.Chain.getChain(chain), address, Boolean(active));
    }
    async getRewardSchedulesVaultsList(chain, active) {
        return this.rewardsService.rewardSchedulesVaultsList(chain_config_1.Chain.getChain(chain), Boolean(active));
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", rewards_service_1.RewardsService)
], RewardsV3Controller.prototype, "rewardsService", void 0);
tslib_1.__decorate([
    (0, schema_1.Hidden)(),
    (0, common_1.Get)('/bouncer'),
    (0, schema_1.ContentType)('json'),
    tslib_1.__param(0, (0, common_1.QueryParams)('address')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], RewardsV3Controller.prototype, "getBouncerProof", null);
tslib_1.__decorate([
    (0, common_1.Get)('/list'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('List the unclaimable reward balances'),
    (0, schema_1.Description)('Returns a paginated chunk of reward balance snapshots for users'),
    (0, schema_1.Returns)(200),
    tslib_1.__param(0, (0, common_1.QueryParams)('chain_id')),
    tslib_1.__param(1, (0, common_1.QueryParams)('page_num')),
    tslib_1.__param(2, (0, common_1.QueryParams)('page_count')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], RewardsV3Controller.prototype, "list", null);
tslib_1.__decorate([
    (0, common_1.Get)('/tree'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)("Get an account's reward proof"),
    (0, schema_1.Description)('Return user badger tree reward proof'),
    (0, schema_1.Returns)(200, reward_merkle_claim_model_interface_1.RewardMerkleClaimModel),
    (0, schema_1.Returns)(404).Description('User has no rewards proof available'),
    tslib_1.__param(0, (0, common_1.QueryParams)('address')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], RewardsV3Controller.prototype, "getBadgerTreeReward", null);
tslib_1.__decorate([
    (0, common_1.UseCache)(),
    (0, common_1.Get)('/schedules'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get all token rewards emmited for vault on network'),
    (0, schema_1.Description)('Return emission schedule list for specified vault'),
    (0, schema_1.Returns)(200, Array).Of(reward_schedules_vault_model_interface_1.RewardSchedulesByVaultModel),
    (0, schema_1.Returns)(404).Description('Unknown vault'),
    tslib_1.__param(0, (0, common_1.QueryParams)('address')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(2, (0, common_1.QueryParams)('active')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], RewardsV3Controller.prototype, "getRewardListSchedulesForVault", null);
tslib_1.__decorate([
    (0, common_1.UseCache)(),
    (0, common_1.Get)('/schedules/list'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get all token rewards emmited for all vaults on network'),
    (0, schema_1.Description)('Return emission schedule list for all vaults'),
    (0, schema_1.Returns)(200, reward_schedules_vaults_model_interface_1.RewardSchedulesByVaultsModel),
    tslib_1.__param(0, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(1, (0, common_1.QueryParams)('active')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], RewardsV3Controller.prototype, "getRewardSchedulesVaultsList", null);
RewardsV3Controller = tslib_1.__decorate([
    (0, common_1.Controller)('/rewards')
], RewardsV3Controller);
exports.RewardsV3Controller = RewardsV3Controller;
//# sourceMappingURL=rewards.v3.controller.js.map