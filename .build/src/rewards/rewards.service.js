"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const ethers_1 = require("ethers");
const accounts_utils_1 = require("../accounts/accounts.utils");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const user_claim_snapshot_model_1 = require("../aws/models/user-claim-snapshot.model");
const s3_utils_1 = require("../aws/s3.utils");
const constants_1 = require("../config/constants");
const nodata_for_addr_error_1 = require("../errors/allocation/nodata.for.addr.error");
const nodata_for_vault_error_1 = require("../errors/allocation/nodata.for.vault.error");
const unsupported_chain_error_1 = require("../errors/validation/unsupported.chain.error");
const rewards_utils_1 = require("./rewards.utils");
let RewardsService = class RewardsService {
    /**
     * Get airdrop merkle claim for a user.
     * @param airdrop Airdrop JSON filename.
     * @param address User Ethereum address.
     */
    async getBouncerProof(chain, address) {
        const fileName = `badger-bouncer-${chain.chainId}.json`;
        const airdropFile = await (0, s3_utils_1.getObject)(constants_1.REWARD_DATA, fileName);
        const fileContents = JSON.parse(airdropFile.toString('utf-8'));
        const claim = fileContents.claims[address.toLowerCase()] || fileContents.claims[ethers_1.ethers.utils.getAddress(address)];
        if (!claim) {
            throw new nodata_for_addr_error_1.NodataForAddrError(`${address}`);
        }
        return claim;
    }
    /**
     * Get badger tree reward merkle claim for a user.
     * @param address User Ethereum address.
     */
    async getUserRewards(chain, address) {
        const userAddress = ethers_1.ethers.utils.getAddress(address);
        const treeDistribution = await (0, rewards_utils_1.getTreeDistribution)(chain);
        if (!treeDistribution) {
            throw new unsupported_chain_error_1.UnsupportedChainError(`${chain.network}`);
        }
        const claim = treeDistribution.claims[userAddress];
        if (!claim) {
            throw new nodata_for_addr_error_1.NodataForAddrError(`${userAddress}`);
        }
        return claim;
    }
    async list({ chain, pageNum = 0, pageCount = constants_1.DEFAULT_PAGE_SIZE, }) {
        const { chainStartBlock, count } = await (0, accounts_utils_1.getLatestMetadata)(chain);
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        const records = [];
        const startingPageId = pageNum * pageCount;
        const endingPageId = startingPageId + pageCount - 1;
        const expression = {
            type: 'Between',
            subject: 'pageId',
            lowerBound: startingPageId,
            upperBound: endingPageId,
        };
        for await (const entry of mapper.query(user_claim_snapshot_model_1.UserClaimSnapshot, { chainStartBlock }, { filter: expression })) {
            records.push(entry);
        }
        return {
            count,
            records: records.sort((record) => record.pageId),
        };
    }
    /**
     * Get all token rewards emmited, by vault
     * @param chain Network chain obj
     * @param address Vault token adress
     * @param active Vault end date is not passed
     */
    async rewardSchedulesByVault(chain, address, active) {
        const chainSdk = await chain.getSdk();
        try {
            const vault = await chain.vaults.getVault(address);
            const loadMethod = active ? 'loadActiveSchedules' : 'loadSchedules';
            return chainSdk.rewards[loadMethod](vault.address);
        }
        catch (err) {
            throw new nodata_for_vault_error_1.NodataForVaultError(address);
        }
    }
    /**
     * Get all token rewards emmited, by all vaults
     * @param chain Network chain obj
     * @param active Vault end date is not passed
     */
    async rewardSchedulesVaultsList(chain, active) {
        const chainSdk = await chain.getSdk();
        const vaults = await chain.vaults.all();
        const vaultsSchedules = await Promise.all(vaults.map(async (vault) => {
            if (!vault.address)
                return [];
            const loadMethod = active ? 'loadActiveSchedules' : 'loadSchedules';
            return chainSdk.rewards[loadMethod](vault.address);
        }));
        return vaultsSchedules.reduce((acc, vaultSchedules) => {
            if (!vaultSchedules || (vaultSchedules === null || vaultSchedules === void 0 ? void 0 : vaultSchedules.length) === 0)
                return acc;
            const [firstVaultSchedule] = vaultSchedules;
            acc[firstVaultSchedule.beneficiary] = vaultSchedules;
            return acc;
        }, {});
    }
};
RewardsService = tslib_1.__decorate([
    (0, common_1.Service)()
], RewardsService);
exports.RewardsService = RewardsService;
//# sourceMappingURL=rewards.service.js.map