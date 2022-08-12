"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const Server_1 = require("../Server");
const metrics_service_1 = require("./metrics.service");
describe('MetricsController', () => {
    let request;
    let metricsService;
    beforeEach(common_1.PlatformTest.bootstrap(Server_1.Server));
    beforeEach(async () => {
        request = (0, supertest_1.default)(common_1.PlatformTest.callback());
        metricsService = common_1.PlatformTest.get(metrics_service_1.MetricsService);
    });
    describe('GET /v2/metrics', () => {
        it('returns metric', async (done) => {
            jest.spyOn(metricsService, 'getProtocolMetrics').mockReturnValue(Promise.resolve({
                totalUsers: 30000,
                totalValueLocked: 100000000000,
                totalVaults: 30,
            }));
            const { body } = await request.get('/v2/metrics').expect(200);
            expect(body).toMatchSnapshot();
            done();
        });
    });
});
//# sourceMappingURL=metrics.controller.spec.js.map