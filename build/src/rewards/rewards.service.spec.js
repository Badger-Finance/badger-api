"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const accountsUtils = tslib_1.__importStar(require("../accounts/accounts.utils"));
const dynamodbUtils = tslib_1.__importStar(require("../aws/dynamodb.utils"));
const bsc_config_1 = require("../chains/config/bsc.config");
const eth_config_1 = require("../chains/config/eth.config");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const user_claim_metadata_1 = require("./entities/user-claim-metadata");
const rewards_service_1 = require("./rewards.service");
const rewardsUtils = tslib_1.__importStar(require("./rewards.utils"));
describe('rewards.service', () => {
    let service;
    beforeEach(async () => {
        await common_1.PlatformTest.create();
        service = common_1.PlatformTest.get(rewards_service_1.RewardsService);
        jest.spyOn(rewardsUtils, 'getTreeDistribution').mockImplementation(async (chain) => {
            if (chain.network !== sdk_1.Network.Ethereum) {
                return null;
            }
            return constants_1.MOCK_DISTRIBUTION_FILE;
        });
    });
    afterEach(common_1.PlatformTest.reset);
    describe('getUserRewards', () => {
        it('throws a bad request on chains with no rewards', async () => {
            const chain = new bsc_config_1.BinanceSmartChain();
            await expect(service.getUserRewards(chain, constants_1.TEST_ADDR)).rejects.toThrow(`${chain.network} is not supportable for request`);
        });
    });
    describe('list', () => {
        it('returns a chunk of claimable snapshots', async () => {
            const rewardsChain = new eth_config_1.Ethereum();
            const previousMockedBlockNumber = 90;
            const startMockedBlockNumber = 100;
            jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain) => {
                return Object.assign(new user_claim_metadata_1.UserClaimMetadata(), {
                    chainStartBlock: dynamodbUtils.getChainStartBlockKey(rewardsChain, previousMockedBlockNumber),
                    chain: chain.network,
                    startBlock: previousMockedBlockNumber,
                    endBlock: startMockedBlockNumber - 1,
                });
            });
            const entries = [
                {
                    address: '0x0',
                    chain: 'eth',
                    chainStartBlock: '0',
                    claimableBalances: [],
                    expiresAt: 0,
                    pageId: 0,
                    startBlock: 0,
                },
            ];
            (0, tests_utils_1.setupMapper)(entries);
            const { records } = await service.list({ chain: rewardsChain });
            expect(records).toEqual(entries);
        });
    });
});
//# sourceMappingURL=rewards.service.spec.js.map