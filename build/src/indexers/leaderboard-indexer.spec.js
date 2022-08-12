"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const accountsUtils = tslib_1.__importStar(require("../accounts/accounts.utils"));
const tokens_config_1 = require("../config/tokens.config");
const tests_utils_1 = require("../test/tests.utils");
const leaderboard_indexer_1 = require("./leaderboard-indexer");
describe('leaderboard-indexer', () => {
    const seeded = (0, tests_utils_1.randomCachedBoosts)(2);
    const addresses = Object.values(tokens_config_1.TOKENS);
    const boostData = {
        userData: Object.fromEntries(seeded.map((cachedBoost, i) => {
            cachedBoost.address = addresses[i];
            const boost = {
                ...cachedBoost,
                multipliers: {},
            };
            return [cachedBoost.address, boost];
        })),
        multiplierData: {},
    };
    let batchPut;
    beforeEach(async () => {
        (0, tests_utils_1.setupMapper)([]);
        batchPut = (0, tests_utils_1.mockBatchPut)([]);
        (0, tests_utils_1.mockBatchDelete)([]);
        jest.spyOn(Date, 'now').mockImplementation(() => 1000);
        jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
        jest.spyOn(accountsUtils, 'getBoostFile').mockImplementation(() => Promise.resolve(boostData));
        await (0, leaderboard_indexer_1.indexBoostLeaderBoard)();
    });
    afterAll(() => jest.resetAllMocks());
    describe('generateBoostsLeaderBoard', () => {
        it('indexes all user accounts', async () => {
            expect(batchPut.mock.calls[0][0]).toMatchObject(Object.values(seeded));
        });
        it('sorts ranks by boosts', async () => {
            let last;
            for (const boost of batchPut.mock.calls[0][0]) {
                if (last) {
                    expect(last).toBeLessThan(boost.boostRank);
                }
                last = boost.boostRank;
            }
        });
        // seeded data has 2 of each boost rank
        it('resovles boost rank ties with stake ratio score', async () => {
            let last;
            for (const boost of batchPut.mock.calls[0][0]) {
                if (last) {
                    expect(last).toBeGreaterThanOrEqual(boost.stakeRatio);
                }
                last = boost.stakeRatio;
            }
        });
    });
});
//# sourceMappingURL=leaderboard-indexer.spec.js.map