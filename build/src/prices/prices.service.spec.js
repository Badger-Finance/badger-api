"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const tests_utils_1 = require("../test/tests.utils");
const prices_service_1 = require("./prices.service");
describe('leaderboards.service', () => {
    let service;
    beforeAll(async () => {
        await common_1.PlatformTest.create();
        service = common_1.PlatformTest.get(prices_service_1.PricesService);
    });
    afterEach(common_1.PlatformTest.reset);
    describe('getPriceSummary', () => {
        it('returns a price summary for the requested chains tokens', async () => {
            (0, tests_utils_1.mockPricing)();
            const results = await service.getPriceSummary(Object.keys(tests_utils_1.TEST_CHAIN.tokens));
            expect(results).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=prices.service.spec.js.map