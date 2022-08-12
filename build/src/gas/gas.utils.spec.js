"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tests_utils_1 = require("../test/tests.utils");
const gasUtils = tslib_1.__importStar(require("./gas.utils"));
describe('gas.utils', () => {
    beforeEach(tests_utils_1.setupChainGasPrices);
    describe('getGasPrices', () => {
        it('returns gas prices for all networks', async () => {
            const gasPrices = await gasUtils.getGasCache();
            expect(gasPrices).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=gas.utils.spec.js.map