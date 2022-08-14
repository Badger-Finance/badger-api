import { PlatformServerless } from "@tsed/platform-serverless";
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing";

import { setupMockChain } from "../test/mocks.utils";
import { GasController } from "./gas.controller";

describe("GasController", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [GasController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(setupMockChain);

  describe("GET /gas", () => {
    it("returns gas price options in eip-1559 format", async () => {
      const { body, statusCode } = await PlatformServerlessTest.request.get("/gas");
      expect(statusCode).toEqual(200);
      expect(JSON.parse(body)).toMatchSnapshot();
    });
  });
});
