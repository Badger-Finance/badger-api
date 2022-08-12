"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const eth_config_1 = require("../chains/config/eth.config");
const tests_utils_1 = require("../test/tests.utils");
const gas_service_1 = require("./gas.service");
describe('GasService', () => {
    const chain = new eth_config_1.Ethereum();
    let service;
    beforeAll(async () => {
        await common_1.PlatformTest.create();
        service = common_1.PlatformTest.get(gas_service_1.GasService);
    });
    afterAll(common_1.PlatformTest.reset);
    describe('getGasPrices', () => {
        it('returns gas prices for a chain', async () => {
            (0, tests_utils_1.setupChainGasPrices)();
            const gasPrices = await service.getGasPrices(chain);
            expect(gasPrices).toMatchObject({
                fast: {
                    maxFeePerGas: expect.any(Number),
                    maxPriorityFeePerGas: expect.any(Number),
                },
                rapid: {
                    maxFeePerGas: expect.any(Number),
                    maxPriorityFeePerGas: expect.any(Number),
                },
                slow: {
                    maxFeePerGas: expect.any(Number),
                    maxPriorityFeePerGas: expect.any(Number),
                },
                standard: {
                    maxFeePerGas: expect.any(Number),
                    maxPriorityFeePerGas: expect.any(Number),
                },
            });
        });
    });
});
//# sourceMappingURL=gas.service.spec.js.map