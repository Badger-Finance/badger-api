"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const exceptions_1 = require("@tsed/exceptions");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const eth_config_1 = require("../chains/config/eth.config");
const tokens_config_1 = require("../config/tokens.config");
const Server_1 = require("../Server");
const constants_1 = require("../test/constants");
const proofs_service_1 = require("./proofs.service");
describe('ProofsController', () => {
    const chain = new eth_config_1.Ethereum();
    let request;
    let proofsService;
    beforeEach(common_1.PlatformTest.bootstrap(Server_1.Server));
    beforeEach(async () => {
        request = (0, supertest_1.default)(common_1.PlatformTest.callback());
        proofsService = common_1.PlatformTest.get(proofs_service_1.ProofsService);
    });
    afterEach(common_1.PlatformTest.reset);
    describe('GET /v2/proofs', () => {
        it('returns 404 for a chain with no bouncer file', async (done) => {
            jest.spyOn(proofsService, 'getBouncerProof').mockImplementation(async () => {
                // simulate no chain path
                throw new exceptions_1.NotFound(`${chain.network} does not have a bouncer list`);
            });
            const { body } = await request.get(`/v2/proofs/${constants_1.TEST_ADDR}`).expect(404);
            expect(body).toMatchSnapshot();
            done();
        });
        it('returns 404 for users not on the bouncer list', async (done) => {
            const badAddress = tokens_config_1.TOKENS.BADGER;
            jest.spyOn(proofsService, 'getBouncerProof').mockImplementation(async () => {
                // simulate no user proofs path
                throw new exceptions_1.NotFound(`${badAddress} is not on the bouncer list`);
            });
            const { body } = await request.get(`/v2/proofs/${badAddress}`).expect(404);
            expect(body).toMatchSnapshot();
            done();
        });
        it('returns 200 and the merkle proof for a user on the bouncer list', async (done) => {
            jest
                .spyOn(proofsService, 'getBouncerProof')
                .mockImplementation(async (_chain, _address) => constants_1.MOCK_BOUNCER_FILE.claims[constants_1.TEST_ADDR].proof);
            const { body } = await request.get(`/v2/proofs/${constants_1.TEST_ADDR}`).expect(200);
            expect(body).toMatchSnapshot();
            done();
        });
    });
});
//# sourceMappingURL=proofs.v2.controller.spec.js.map