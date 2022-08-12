"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const tokens_config_1 = require("../config/tokens.config");
const network_status_enum_1 = require("../errors/enums/network-status.enum");
const Server_1 = require("../Server");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const vaults_v2_controller_spec_1 = require("./vaults.v2.controller.spec");
const TEST_VAULT = tokens_config_1.TOKENS.BCRV_SBTC;
describe('VaultsController', () => {
    let request;
    beforeAll(common_1.PlatformTest.bootstrap(Server_1.Server));
    beforeAll(async () => {
        request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    });
    afterAll(common_1.PlatformTest.reset);
    describe('GET /v3/vaults/list', () => {
        describe('with no specified chain', () => {
            it('returns eth vaults', async (done) => {
                (0, tests_utils_1.setupVaultsCoumpoundDDB)();
                (0, vaults_v2_controller_spec_1.setupTestVault)();
                const { body } = await request.get('/v3/vaults/list').expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with a specified chain', () => {
            it('returns the vaults for eth', async (done) => {
                (0, tests_utils_1.setupVaultsCoumpoundDDB)();
                (0, vaults_v2_controller_spec_1.setupTestVault)();
                const { body } = await request.get('/v3/vaults/list?chain=ethereum').expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
            it('returns the vaults for polygon', async (done) => {
                (0, tests_utils_1.setupVaultsCoumpoundDDB)();
                (0, vaults_v2_controller_spec_1.setupTestVault)();
                const { body } = await request.get('/v3/vaults/list?chain=polygon').expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('with an invalid specified chain', () => {
            it('returns a 400', async (done) => {
                const { body } = await request.get('/v3/vaults/list?chain=invalid').expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
    describe('GET /v3/vaults/list/harvests', () => {
        beforeEach(vaults_v2_controller_spec_1.setupDdbHarvests);
        describe('success cases', () => {
            it('Return extended harvest for chain vaults', async (done) => {
                const { body } = await request.get('/v3/vaults/list/harvests').expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('error cases', () => {
            it('returns a 400 for invalide chain', async (done) => {
                const { body } = await request.get('/v3/vaults/list/harvests?chain=invalid').expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
    describe('GET /v3/vaults/harvests', () => {
        beforeEach(vaults_v2_controller_spec_1.setupDdbHarvests);
        describe('success cases', () => {
            it('Return extended harvests for chain vault by addr', async (done) => {
                const { body } = await request.get(`/v3/vaults/harvests?vault=${TEST_VAULT}`).expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('error cases', () => {
            it('returns a 400 for invalide chain', async (done) => {
                const { body } = await request
                    .get(`/v3/vaults/harvests?vault=${TEST_VAULT}&chain=invalid`)
                    .expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
    describe('GET /v3/vaults/snapshots', () => {
        beforeEach(async () => {
            (0, tests_utils_1.setupDdbVaultsChartsData)();
            (0, tests_utils_1.mockChainVaults)();
        });
        describe('success cases', () => {
            it('return 200 and vaults snapshots for all dates, without duplications', async (done) => {
                const timestampsStr = '1645103004000,1645015261000,1644928124000,1644928124000,1644928124000';
                const { body } = await request
                    .get(`/v3/vaults/snapshots?vault=${constants_1.TEST_ADDR}&timestamps=${timestampsStr}&chain=${sdk_1.Network.Arbitrum}`)
                    .expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
            it('return 200 with 1 relevant vault and 2 old snapshots', async (done) => {
                const timestampsStr = '1645189933000,1634821933000,1634821931000';
                const { body } = await request
                    .get(`/v3/vaults/snapshots?vault=${constants_1.TEST_ADDR}&timestamps=${timestampsStr}&chain=${sdk_1.Network.Arbitrum}`)
                    .expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
            it('return 200 with empty array, got unmached data', async (done) => {
                const timestampsStr = Date.now() * 2;
                const { body } = await request
                    .get(`/v3/vaults/snapshots?vault=${constants_1.TEST_ADDR}&timestamps=${timestampsStr}&chain=${sdk_1.Network.Arbitrum}`)
                    .expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
                done();
            });
        });
        describe('error cases', () => {
            it('returns a 400 for invalide chain', async (done) => {
                const timestampsStr = '1645189933000,1634821933000,1634821931000';
                const { body } = await request
                    .get(`/v3/vaults/snapshots?vault=${constants_1.TEST_ADDR}&timestamps=${timestampsStr}&chain=invalid`)
                    .expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
                done();
            });
            it('returns a 400 for missed vault address param', async (done) => {
                const timestampsStr = '1645189933000,1634821933000,1634821931000';
                const { body } = await request
                    .get(`/v3/vaults/snapshots?timestamps=${timestampsStr}&chain=${sdk_1.Network.Arbitrum}`)
                    .expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
                done();
            });
            it('returns a 400 for invalide timestamps', async (done) => {
                const timestampsStr = 'Invalid Timestamps';
                const { body } = await request
                    .get(`/v3/vaults/snapshots?vault=${constants_1.TEST_ADDR}&timestamps=${timestampsStr}&chain=${sdk_1.Network.Arbitrum}`)
                    .expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
                done();
            });
        });
    });
});
//# sourceMappingURL=vaults.v3.controller.spec.js.map