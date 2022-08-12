"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const loadSchedules_json_1 = tslib_1.__importDefault(require("@badger-dao/sdk-mocks/generated/ethereum/rewards/loadSchedules.json"));
const common_1 = require("@tsed/common");
const exceptions_1 = require("@tsed/exceptions");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const chain_vaults_1 = require("../chains/vaults/chain.vaults");
const tokens_config_1 = require("../config/tokens.config");
const network_status_enum_1 = require("../errors/enums/network-status.enum");
const Server_1 = require("../Server");
const tests_utils_1 = require("../test/tests.utils");
describe('RewardController', () => {
    let request;
    const schedulesMockMap = {
        [tokens_config_1.TOKENS.BBADGER]: loadSchedules_json_1.default,
        [tokens_config_1.TOKENS.BCVX]: loadSchedules_json_1.default.map((rw) => ({
            ...rw,
            beneficiary: tokens_config_1.TOKENS.BCVX,
        })),
    };
    const activeSchedulesMockMap = {
        [tokens_config_1.TOKENS.BBADGER]: schedulesMockMap[tokens_config_1.TOKENS.BBADGER].map((rw) => ({
            ...rw,
            compPercent: 50,
        })),
        [tokens_config_1.TOKENS.BCVX]: schedulesMockMap[tokens_config_1.TOKENS.BCVX].map((rw) => ({
            ...rw,
            compPercent: 70,
        })),
    };
    function setupDefaultMocks() {
        jest.spyOn(sdk_1.RewardsService.prototype, 'loadSchedules').mockImplementation(async (beneficiary) => {
            return schedulesMockMap[beneficiary];
        });
        jest.spyOn(sdk_1.RewardsService.prototype, 'loadActiveSchedules').mockImplementation(async (beneficiary) => {
            return activeSchedulesMockMap[beneficiary];
        });
        jest.spyOn(sdk_1.default.prototype, 'ready').mockImplementation();
        (0, tests_utils_1.mockChainVaults)();
    }
    beforeAll(common_1.PlatformTest.bootstrap(Server_1.Server));
    beforeAll(async () => {
        request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    });
    afterAll(common_1.PlatformTest.reset);
    describe('GET /v3/rewards/schedules', () => {
        describe('with no specified chain', () => {
            it('returns schedules for default chain and all vaults', async (done) => {
                setupDefaultMocks();
                const { body } = await request.get('/v3/rewards/schedules/list').expect(200);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with active param true', () => {
            it('returns active schedules for default chain and all vaults', async (done) => {
                setupDefaultMocks();
                const { body } = await request.get('/v3/rewards/schedules/list?active=true').expect(200);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with an invalid specified chain', () => {
            it('returns a 400', async (done) => {
                setupDefaultMocks();
                const { body } = await request.get('/v3/rewards/schedules/list?chain=invalid').expect(exceptions_1.BadRequest.STATUS);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
    describe('GET /v3/rewards/schedules', () => {
        describe('with no specified chain', () => {
            it('returns schedule for default chain and one vault', async (done) => {
                setupDefaultMocks();
                const { body } = await request
                    .get(`/v3/rewards/schedules?address=${tokens_config_1.TOKENS.BBADGER}`)
                    .expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with active param true', () => {
            it('returns schedules for default chain and one vault', async (done) => {
                setupDefaultMocks();
                const { body } = await request
                    .get(`/v3/rewards/schedules?address=${tokens_config_1.TOKENS.BBADGER}&active=true`)
                    .expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with an invalid specified chain', () => {
            it('returns a 400', async (done) => {
                setupDefaultMocks();
                const { body } = await request
                    .get(`/v3/rewards/schedules?address=${tokens_config_1.TOKENS.BBADGER}&chain=invalid`)
                    .expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with invalid param specified', () => {
            it('returns a 404, NotFound', async (done) => {
                setupDefaultMocks();
                jest.spyOn(chain_vaults_1.ChainVaults.prototype, 'getVault').mockImplementation(async (_) => {
                    throw new Error('Missing Vault');
                });
                const { body } = await request
                    .get(`/v3/rewards/schedules?address=unknowsvaultdata`)
                    .expect(network_status_enum_1.NetworkStatus.NotFound);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
});
//# sourceMappingURL=rewards.v3.controller.spec.js.map