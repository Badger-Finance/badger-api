"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const network_status_enum_1 = require("../errors/enums/network-status.enum");
const Server_1 = require("../Server");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
describe('ChartsController', () => {
    let request;
    beforeEach(common_1.PlatformTest.bootstrap(Server_1.Server));
    beforeEach(async () => {
        (0, tests_utils_1.mockChainVaults)();
        request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    });
    afterEach(common_1.PlatformTest.reset);
    describe('GET /v3/charts/vault', () => {
        describe('with a missing vault address', () => {
            it('returns 400, QueryParamError', async () => {
                const { body } = await request.get('/v3/charts/vault').expect(network_status_enum_1.NetworkStatus.BadRequest);
                expect(body).toMatchSnapshot();
            });
        });
        describe('get vault data with different timeframes', () => {
            it('should return vault data for YTD', async () => {
                (0, tests_utils_1.setupVaultsHistoricDDB)();
                const { body } = await request
                    .get(`/v3/charts/vault?address=${constants_1.TEST_ADDR}&timeframe=${sdk_1.ChartTimeFrame.YTD}`)
                    .expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
            });
            it('should return vault data for 1Y', async () => {
                (0, tests_utils_1.setupVaultsHistoricDDB)();
                const { body } = await request
                    .get(`/v3/charts/vault?address=${constants_1.TEST_ADDR}&timeframe=${sdk_1.ChartTimeFrame.Year}`)
                    .expect(network_status_enum_1.NetworkStatus.Success);
                expect(body).toMatchSnapshot();
            });
        });
    });
});
//# sourceMappingURL=charts.controller.spec.js.map