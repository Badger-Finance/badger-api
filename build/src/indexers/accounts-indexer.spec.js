"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const sdk_1 = require("@badger-dao/sdk");
const bignumber_1 = require("@ethersproject/bignumber");
const accountsUtils = tslib_1.__importStar(require("../accounts/accounts.utils"));
const dynamodbUtils = tslib_1.__importStar(require("../aws/dynamodb.utils"));
const user_claim_snapshot_model_1 = require("../aws/models/user-claim-snapshot.model");
const bsc_config_1 = require("../chains/config/bsc.config");
const chain_config_1 = require("../chains/config/chain.config");
const eth_config_1 = require("../chains/config/eth.config");
const tokens_config_1 = require("../config/tokens.config");
const claimable_balance_1 = require("../rewards/entities/claimable-balance");
const user_claim_metadata_1 = require("../rewards/entities/user-claim-metadata");
const rewardsUtils = tslib_1.__importStar(require("../rewards/rewards.utils"));
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const accountsIndexer = tslib_1.__importStar(require("./accounts-indexer"));
describe('accounts-indexer', () => {
    const rewardsChain = new eth_config_1.Ethereum();
    const noRewardsChain = new bsc_config_1.BinanceSmartChain();
    const previousMockedBlockNumber = 90;
    const startMockedBlockNumber = 100;
    const endMockedBlockNumber = 110;
    let getAccounts;
    let getLatestMetadata;
    let getTreeDistribution;
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(jest.fn);
        // utilize getAccounts as a canary for detecting the network calls being made
        getAccounts = jest
            .spyOn(accountsUtils, 'getAccounts')
            .mockImplementation((chain) => Promise.resolve([chain.network]));
        getTreeDistribution = jest.spyOn(rewardsUtils, 'getTreeDistribution').mockImplementation(async (chain) => {
            if (chain.network !== sdk_1.Network.Ethereum) {
                return null;
            }
            return constants_1.MOCK_DISTRIBUTION_FILE;
        });
        getLatestMetadata = jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain) => {
            return Object.assign(new user_claim_metadata_1.UserClaimMetadata(), {
                chainStartBlock: dynamodbUtils.getChainStartBlockKey(rewardsChain, previousMockedBlockNumber),
                chain: chain.network,
                startBlock: previousMockedBlockNumber,
                endBlock: startMockedBlockNumber - 1,
            });
        });
        jest.spyOn(rewardsChain.provider, 'getBlockNumber').mockImplementation(async () => endMockedBlockNumber);
    });
    describe('refreshClaimableBalances', () => {
        it('takes no action on chains with no rewards', async () => {
            jest.spyOn(chain_config_1.Chain.prototype, 'getSdk').mockImplementation(async () => tests_utils_1.TEST_CHAIN.sdk);
            await accountsIndexer.refreshClaimableBalances(noRewardsChain);
            expect(getTreeDistribution.mock.calls.length).toEqual(1);
            expect(getTreeDistribution.mock.calls[0][0]).toMatchObject(noRewardsChain);
            expect(getAccounts.mock.calls.length).toEqual(0);
        });
        it('looks up all user claimable balances on chains with rewards and persists them', async () => {
            const testAccounts = [tokens_config_1.TOKENS.WBTC, tokens_config_1.TOKENS.DAI, tokens_config_1.TOKENS.WETH, tokens_config_1.TOKENS.USDT, tokens_config_1.TOKENS.USDC];
            jest.spyOn(accountsUtils, 'getAccounts').mockImplementation((_chain) => Promise.resolve(testAccounts));
            const claimableResults = [
                [tokens_config_1.TOKENS.BADGER, tokens_config_1.TOKENS.DIGG],
                [bignumber_1.BigNumber.from(10000), bignumber_1.BigNumber.from(12)],
            ];
            let usersChecked;
            jest
                .spyOn(rewardsUtils, 'getClaimableRewards')
                .mockImplementation(async (_chain, chainUsers, _distribution) => {
                usersChecked = chainUsers;
                return chainUsers.map((u) => [u, claimableResults]);
            });
            const [tokens, amounts] = claimableResults;
            const claimableBalances = tokens.map((token, i) => {
                const amount = amounts[i];
                return Object.assign(new claimable_balance_1.ClaimableBalance(), {
                    address: token,
                    balance: amount.toString(),
                });
            });
            let pageId = 0;
            const expected = [];
            for (const acc of testAccounts) {
                expected.push(Object.assign(new user_claim_snapshot_model_1.UserClaimSnapshot(), {
                    chainStartBlock: dynamodbUtils.getChainStartBlockKey(rewardsChain, startMockedBlockNumber),
                    chain: rewardsChain.network,
                    startBlock: startMockedBlockNumber,
                    address: acc,
                    claimableBalances,
                    pageId: pageId++,
                }));
            }
            const put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
            const expectedMetadata = Object.assign(new user_claim_metadata_1.UserClaimMetadata(), {
                // startBlock for next stored metaData obj should be endBlock + 1 value of the previous metaData entity
                chainStartBlock: dynamodbUtils.getChainStartBlockKey(rewardsChain, startMockedBlockNumber),
                chain: rewardsChain.network,
                startBlock: startMockedBlockNumber,
                endBlock: endMockedBlockNumber,
                cycle: constants_1.MOCK_DISTRIBUTION_FILE.cycle,
                count: expected.length,
            });
            const batchPut = (0, tests_utils_1.mockBatchPut)(expected);
            await accountsIndexer.refreshClaimableBalances(rewardsChain);
            // verify tree distribution was loaded, and the proper chain was called
            expect(getTreeDistribution.mock.calls.length).toEqual(1);
            expect(getTreeDistribution.mock.calls[0][0]).toMatchObject(rewardsChain);
            // verify get accounts was called, and the proper expected accounts were returned
            expect(getAccounts.mock.calls.length).toEqual(1);
            expect(getAccounts.mock.calls[0][0]).toMatchObject(rewardsChain);
            expect(getLatestMetadata.mock.calls.length).toEqual(1);
            expect(put.mock.calls[0][0]).toEqual(expectedMetadata);
            // verify the function calls the update on all expected accounts
            expect(usersChecked).toMatchObject(testAccounts);
            // verify the function saved the expected data on all expected accounts
            expect(batchPut.mock.calls[0][0]).toEqual(expected);
        });
    });
});
//# sourceMappingURL=accounts-indexer.spec.js.map