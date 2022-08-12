"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const eth_config_1 = require("../chains/config/eth.config");
const constants_1 = require("../test/constants");
const accounts_service_1 = require("./accounts.service");
const accountsUtils = tslib_1.__importStar(require("./accounts.utils"));
describe('accounts.service', () => {
    const chain = new eth_config_1.Ethereum();
    let service;
    beforeAll(async () => {
        await common_1.PlatformTest.create();
        service = common_1.PlatformTest.get(accounts_service_1.AccountsService);
    });
    afterEach(common_1.PlatformTest.reset);
    describe('getAccount', () => {
        it('returns the expected account', async () => {
            jest.spyOn(accountsUtils, 'getCachedAccount').mockImplementation(async (_chain, address) => {
                const cachedAccount = {
                    address,
                    value: 10,
                    earnedValue: 1,
                    boost: 2000,
                    boostRank: 1,
                    data: {},
                    claimableBalances: {},
                    stakeRatio: 1,
                    nftBalance: 3,
                    bveCvxBalance: 1,
                    diggBalance: 1,
                    nativeBalance: 5,
                    nonNativeBalance: 5,
                };
                return cachedAccount;
            });
            const result = await service.getAccount(chain, constants_1.TEST_ADDR);
            expect(result).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=accounts.service.spec.js.map