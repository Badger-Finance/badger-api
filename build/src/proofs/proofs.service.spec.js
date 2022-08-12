"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const s3Utils = tslib_1.__importStar(require("../aws/s3.utils"));
const tokens_config_1 = require("../config/tokens.config");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const proofs_service_1 = require("./proofs.service");
describe('proofs.service', () => {
    let service;
    beforeAll(async () => {
        await common_1.PlatformTest.create();
        service = common_1.PlatformTest.get(proofs_service_1.ProofsService);
    });
    afterEach(common_1.PlatformTest.reset);
    describe('getBouncerProof', () => {
        it('throws a 404 when a chain is missing a bouncer file', async () => {
            jest.spyOn(s3Utils, 'getObject').mockImplementation();
            await expect(service.getBouncerProof(tests_utils_1.TEST_CHAIN, constants_1.TEST_ADDR)).rejects.toThrow(`${tests_utils_1.TEST_CHAIN.network} does not have requested data`);
        });
        it('throws a 404 when a chain is missing an entry for the user in the bouncer file', async () => {
            jest.spyOn(s3Utils, 'getObject').mockImplementation(async () => JSON.stringify(constants_1.MOCK_BOUNCER_FILE));
            await expect(service.getBouncerProof(tests_utils_1.TEST_CHAIN, tokens_config_1.TOKENS.BADGER)).rejects.toThrow(`No data for specified address: ${tokens_config_1.TOKENS.BADGER}`);
        });
        it('returns the user proof for a user on the bouncer list', async () => {
            jest.spyOn(s3Utils, 'getObject').mockImplementation(async () => JSON.stringify(constants_1.MOCK_BOUNCER_FILE));
            const result = await service.getBouncerProof(tests_utils_1.TEST_CHAIN, constants_1.TEST_ADDR);
            expect(result).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=proofs.service.spec.js.map