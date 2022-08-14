import { BadRequest } from "@tsed/exceptions";
import { PlatformServerless } from "@tsed/platform-serverless";
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing";

import { Chain } from "../chains/config/chain.config";
import { setupMockChain } from "../test/mocks.utils";
import { PricesController } from "./prices.controller";

describe("PricesController", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [PricesController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(setupMockChain);

  describe("GET /v2/prices", () => {
    describe("with a valid specified chain", () => {
      it("returns token config", async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get("/prices");
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe("with an invalid specified chain", () => {
      it("returns a 400", async () => {
        jest.spyOn(Chain, "getChain").mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request.get("/prices?chain=invalid");
        expect(statusCode).toEqual(400);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
