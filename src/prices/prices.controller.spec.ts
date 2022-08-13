import { PlatformTest } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";
import SuperTest from "supertest";

import { Server } from "../server";
import { TEST_ADDR, TEST_TOKEN } from "../test/constants";
import { setupMockChain } from "../test/mocks.utils";
import { PricesService } from "./prices.service";

describe("PricesController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let pricesService: PricesService;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    pricesService = PlatformTest.get<PricesService>(PricesService);
    setupMockChain();
  });

  afterEach(PlatformTest.reset);

  const getPrice = (address: string): number => parseInt(address.slice(0, 3), 16);

  describe("GET /v2/prices", () => {
    describe("with a valid specified chain", () => {
      it("returns token config", async () => {
        const result = Object.fromEntries([TEST_TOKEN, TEST_ADDR].map((token) => [token, getPrice(token)]));
        jest.spyOn(pricesService, "getPriceSummary").mockImplementationOnce(() => Promise.resolve(result));
        const { body } = await request.get("/v2/prices").expect(200);
        expect(body).toMatchSnapshot();
      });
    });

    describe("with an invalid specified chain", () => {
      it("returns a 400", async () => {
        const { body } = await request.get("/v2/prices?chain=invalid").expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
      });
    });
  });
});
