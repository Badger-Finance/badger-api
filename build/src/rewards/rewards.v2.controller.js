"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsV2Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const ethers_1 = require("ethers");
const chain_config_1 = require("../chains/config/chain.config");
const constants_1 = require("../config/constants");
const tokens_config_1 = require("../config/tokens.config");
const tokens_utils_1 = require("../tokens/tokens.utils");
const rewards_service_1 = require("./rewards.service");
const rewards_utils_1 = require("./rewards.utils");
let RewardsV2Controller = class RewardsV2Controller {
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
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", rewards_service_1.RewardsService)
], RewardsV2Controller.prototype, "rewardsService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)(),
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
], RewardsV2Controller.prototype, "list", null);
RewardsV2Controller = tslib_1.__decorate([
    (0, schema_1.Deprecated)(),
    (0, common_1.Controller)('/rewards')
], RewardsV2Controller);
exports.RewardsV2Controller = RewardsV2Controller;
//# sourceMappingURL=rewards.v2.controller.js.map