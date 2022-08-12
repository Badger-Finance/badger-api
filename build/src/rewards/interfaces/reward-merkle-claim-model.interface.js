"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardMerkleClaimModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const ethers_1 = require("ethers");
const tokens_config_1 = require("../../config/tokens.config");
class RewardMerkleClaimModel {
    constructor(claim) {
        this.index = claim.index;
        this.cycle = claim.cycle;
        this.user = claim.user;
        this.tokens = claim.tokens;
        this.cumulativeAmounts = claim.cumulativeAmounts;
        this.proof = claim.proof;
        this.node = claim.node;
    }
}
tslib_1.__decorate([
    (0, schema_1.Title)('index'),
    (0, schema_1.Description)('User reward entry index'),
    (0, schema_1.Example)('0x3'),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
], RewardMerkleClaimModel.prototype, "index", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('cycle'),
    (0, schema_1.Description)('Proof corresponding reward cycle'),
    (0, schema_1.Example)('0x487'),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
], RewardMerkleClaimModel.prototype, "cycle", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('user'),
    (0, schema_1.Description)('User account id'),
    (0, schema_1.Example)('0x0f571D2625b503BB7C1d2b5655b483a2Fa696fEf'),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
], RewardMerkleClaimModel.prototype, "user", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('tokens'),
    (0, schema_1.Description)('Tokens available to claim'),
    (0, schema_1.Example)([tokens_config_1.TOKENS.BADGER, tokens_config_1.TOKENS.DIGG, tokens_config_1.TOKENS.XSUSHI]),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
], RewardMerkleClaimModel.prototype, "tokens", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('cumulativeAmounts'),
    (0, schema_1.Description)('Total historic claimable token amounts in wei'),
    (0, schema_1.Example)([
        ethers_1.ethers.constants.WeiPerEther.mul(2).toString(),
        ethers_1.ethers.constants.WeiPerEther.mul(12887527662).toString(),
        ethers_1.ethers.constants.WeiPerEther.mul(6).div(1000).toString(),
    ]),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
], RewardMerkleClaimModel.prototype, "cumulativeAmounts", void 0);
tslib_1.__decorate([
    (0, schema_1.Title)('proof'),
    (0, schema_1.Description)('Reward cycle merkle proof'),
    (0, schema_1.Example)([
        '0xcd678491cc646856ce19ab692f9070861332e300',
        '0xcd678491cc646856ce19ab692f9070861332e300',
        '0xcd678491cc646856ce19ab692f9070861332e300',
        '0xcd678491cc646856ce19ab692f9070861332e300',
        '0xcd678491cc646856ce19ab692f9070861332e300',
    ]),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Array)
], RewardMerkleClaimModel.prototype, "proof", void 0);
tslib_1.__decorate([
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
], RewardMerkleClaimModel.prototype, "node", void 0);
exports.RewardMerkleClaimModel = RewardMerkleClaimModel;
//# sourceMappingURL=reward-merkle-claim-model.interface.js.map