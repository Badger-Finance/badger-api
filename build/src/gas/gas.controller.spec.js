"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const Server_1 = require("../Server");
const tests_utils_1 = require("../test/tests.utils");
describe('GasController', () => {
    let request;
    beforeAll(common_1.PlatformTest.bootstrap(Server_1.Server));
    beforeAll(() => {
        request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    });
    beforeEach(() => {
        jest.resetAllMocks();
        (0, tests_utils_1.setupChainGasPrices)();
    });
    afterAll(common_1.PlatformTest.reset);
    describe('GET /v2/gas', () => {
        it('returns a list of gas prices in eip-1559 format', async (done) => {
            const { body } = await request.get('/v2/gas').expect(200);
            expect(body).toMatchSnapshot();
            done();
        });
    });
    it('returns a list of gas prices in legacy format', async (done) => {
        const { body } = await request.get('/v2/gas?chain=polygon').expect(200);
        expect(body).toMatchSnapshot();
        done();
    });
});
//# sourceMappingURL=gas.controller.spec.js.map