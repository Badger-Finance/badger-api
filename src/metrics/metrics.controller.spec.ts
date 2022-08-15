import { PlatformServerless } from "@tsed/platform-serverless";
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing";

import { NetworkStatus } from "../errors/enums/network-status.enum";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";

describe("MetricsController", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [MetricsController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("GET /v2/metrics", () => {
    it("returns metric", async () => {
      jest.spyOn(MetricsService.prototype, "getProtocolMetrics").mockReturnValue(
        Promise.resolve({
          totalUsers: 30_000,
          totalValueLocked: 100_000_000_000,
          totalVaults: 30
        })
      );
      const { body, statusCode } = await PlatformServerlessTest.request.get("/metrics");
      expect(statusCode).toEqual(NetworkStatus.Success);
      expect(JSON.parse(body)).toMatchSnapshot();
    });
  });
});
