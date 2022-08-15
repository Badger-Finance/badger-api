"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const exceptions_1 = require("@tsed/exceptions");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const Server_1 = require("../Server");
const bsc_tokens_config_1 = require("../tokens/config/bsc-tokens.config");
const eth_tokens_config_1 = require("../tokens/config/eth-tokens.config");
const prices_service_1 = require("./prices.service");
describe("PricesController", () => {
  let request;
  let pricesService;
  beforeEach(common_1.PlatformTest.bootstrap(Server_1.Server));
  beforeEach(async () => {
    request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    pricesService = common_1.PlatformTest.get(prices_service_1.PricesService);
  });
  afterEach(common_1.PlatformTest.reset);
  const getPrice = (address) => parseInt(address.slice(0, 3), 16);
  describe("GET /v2/prices", () => {
    describe("with no specified chain", () => {
      it("returns eth token config", async (done) => {
        const result = Object.fromEntries(
          Object.keys(eth_tokens_config_1.ethTokensConfig).map((token) => [token, getPrice(token)])
        );
        jest.spyOn(pricesService, "getPriceSummary").mockImplementationOnce(() => Promise.resolve(result));
        const { body } = await request.get("/v2/prices").expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe("with a specified chain", () => {
      it("returns the specified token config for eth", async (done) => {
        const result = Object.fromEntries(
          Object.keys(eth_tokens_config_1.ethTokensConfig).map((token) => [token, getPrice(token)])
        );
        jest.spyOn(pricesService, "getPriceSummary").mockImplementationOnce(() => Promise.resolve(result));
        const { body } = await request.get("/v2/prices?chain=ethereum").expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
      it("returns the specified token config for bsc", async (done) => {
        const result = Object.fromEntries(
          Object.keys(bsc_tokens_config_1.bscTokensConfig).map((token) => [token, getPrice(token)])
        );
        jest.spyOn(pricesService, "getPriceSummary").mockImplementationOnce(() => Promise.resolve(result));
        const { body } = await request.get("/v2/prices?chain=binancesmartchain").expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe("with an invalid specified chain", () => {
      it("returns a 400", async (done) => {
        const { body } = await request.get("/v2/prices?chain=invalid").expect(exceptions_1.BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
//# sourceMappingURL=prices.controller.spec.js.map
