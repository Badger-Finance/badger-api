"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const tokens_config_1 = require("../config/tokens.config");
const nodata_for_addr_error_1 = require("../errors/allocation/nodata.for.addr.error");
const nodata_for_chain_error_1 = require("../errors/allocation/nodata.for.chain.error");
const network_status_enum_1 = require("../errors/enums/network-status.enum");
const Server_1 = require("../Server");
const constants_1 = require("../test/constants");
const proofs_service_1 = require("./proofs.service");
describe("ProofsController", () => {
  let request;
  let proofsService;
  beforeEach(common_1.PlatformTest.bootstrap(Server_1.Server));
  beforeEach(async () => {
    request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    proofsService = common_1.PlatformTest.get(proofs_service_1.ProofsService);
  });
  afterEach(common_1.PlatformTest.reset);
  describe("GET /v3/proofs", () => {
    it("returns 404 for a chain with no bouncer file", async (done) => {
      jest.spyOn(proofsService, "getBouncerProof").mockImplementation(async (chain) => {
        // simulate no chain path
        throw new nodata_for_chain_error_1.NodataForChainError(chain.network);
      });
      const { body } = await request
        .get(`/v3/proof?address=${constants_1.TEST_ADDR}`)
        .expect(network_status_enum_1.NetworkStatus.NotFound);
      expect(body).toMatchSnapshot();
      done();
    });
    it("returns 404 for users not on the bouncer list", async (done) => {
      const badAddress = tokens_config_1.TOKENS.BADGER;
      jest.spyOn(proofsService, "getBouncerProof").mockImplementation(async () => {
        // simulate no user proofs path
        throw new nodata_for_addr_error_1.NodataForAddrError(`${constants_1.TEST_ADDR}`);
      });
      const { body } = await request
        .get(`/v3/proof?address=${badAddress}`)
        .expect(network_status_enum_1.NetworkStatus.NotFound);
      expect(body).toMatchSnapshot();
      done();
    });
    it("returns 200 and the merkle proof for a user on the bouncer list", async (done) => {
      jest
        .spyOn(proofsService, "getBouncerProof")
        .mockImplementation(
          async (_chain, _address) => constants_1.MOCK_BOUNCER_FILE.claims[constants_1.TEST_ADDR].proof
        );
      const { body } = await request
        .get(`/v3/proof?address=${constants_1.TEST_ADDR}`)
        .expect(network_status_enum_1.NetworkStatus.Success);
      expect(body).toMatchSnapshot();
      done();
    });
  });
});
//# sourceMappingURL=proof.v3.controller.spec.js.map
