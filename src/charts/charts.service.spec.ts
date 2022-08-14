import { ChartTimeFrame } from "@badger-dao/sdk";
import { PlatformTest } from "@tsed/common";

import { MOCK_VAULT_SNAPSHOT } from "../test/constants";
import { setupMockChain } from "../test/mocks.utils";
import { ChartsService } from "./charts.service";

describe("charts.service", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  describe("loadVaultChartData", () => {
    it("returns requested vault chart data if exists", async () => {
      const chain = setupMockChain();
      const service = PlatformTest.get<ChartsService>(ChartsService);
      const charts = await service.loadVaultChartData(MOCK_VAULT_SNAPSHOT.address, ChartTimeFrame.Max, chain);
      expect(charts).toMatchSnapshot();
    });
  });
});
