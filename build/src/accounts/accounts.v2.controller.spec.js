"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const exceptions_1 = require("@tsed/exceptions");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const Server_1 = require("../Server");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const accountsUtils = tslib_1.__importStar(require("./accounts.utils"));
describe("AccountsController", () => {
  let request;
  beforeEach(common_1.PlatformTest.bootstrap(Server_1.Server));
  beforeEach(async () => {
    request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    jest.resetAllMocks();
    (0, tests_utils_1.setupMockAccounts)();
  });
  afterEach(common_1.PlatformTest.reset);
  describe("GET /v2/accounts", () => {
    describe("with no specified account", () => {
      it("returns a not found response", async (done) => {
        const { body } = await request.get("/v2/accounts").expect(exceptions_1.NotFound.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe("with an invalid account input", () => {
      it("returns a bad request response", async (done) => {
        const { body } = await request.get("/v2/accounts/0xjintao").expect(exceptions_1.BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe("with a non participant account", () => {
      it("returns a default account response", async (done) => {
        jest.spyOn(accountsUtils, "getCachedAccount").mockImplementation(async (_chain, address) => ({
          address,
          value: 0,
          earnedValue: 0,
          boost: 1,
          rank: 1035,
          boostRank: 1035,
          multipliers: {},
          data: {},
          claimableBalances: {},
          stakeRatio: 0,
          nftBalance: 0,
          bveCvxBalance: 0,
          diggBalance: 0,
          nativeBalance: 0,
          nonNativeBalance: 0
        }));
        const { body } = await request.get("/v2/accounts/" + constants_1.TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe("with a participant account", () => {
      it("returns a cached account response", async (done) => {
        jest.spyOn(accountsUtils, "getCachedAccount").mockImplementation(async (_chain, address) => ({
          address,
          value: 10,
          earnedValue: 1,
          boost: 2000,
          rank: 1,
          boostRank: 1,
          multipliers: {},
          data: {},
          claimableBalances: {},
          stakeRatio: 1,
          nftBalance: 3,
          bveCvxBalance: 0,
          diggBalance: 0,
          nativeBalance: 3,
          nonNativeBalance: 5
        }));
        const { body } = await request.get("/v2/accounts/" + constants_1.TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
//# sourceMappingURL=accounts.v2.controller.spec.js.map
