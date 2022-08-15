"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const historic_vault_snapshot_model_1 = require("../aws/models/historic-vault-snapshot.model");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const charts_service_1 = require("./charts.service");
const chartsUtils = tslib_1.__importStar(require("./charts.utils"));
describe("charts.service", () => {
  let service;
  beforeAll(async () => {
    await common_1.PlatformTest.create();
    service = common_1.PlatformTest.get(charts_service_1.ChartsService);
  });
  afterEach(common_1.PlatformTest.reset);
  describe("loadVaultChartData", () => {
    it("returns requested vault chart data if exists", async () => {
      (0, tests_utils_1.mockChainVaults)();
      jest.spyOn(chartsUtils, "queryVaultCharts").mockImplementation(async (_k) =>
        constants_1.MOCK_VAULT_SNAPSHOTS.slice(0, 4).map((snapshot) => {
          const historicSnapshot = Object.assign(new historic_vault_snapshot_model_1.HistoricVaultSnapshotModel(), {
            ...snapshot,
            id: (0, dynamodb_utils_1.getVaultEntityId)(tests_utils_1.TEST_CHAIN, constants_1.MOCK_VAULT_SNAPSHOT),
            timestamp: constants_1.TEST_CURRENT_TIMESTAMP
          });
          return historicSnapshot;
        })
      );
      const charts = await service.loadVaultChartData(
        constants_1.MOCK_VAULT_SNAPSHOT.address,
        sdk_1.ChartTimeFrame.Max,
        tests_utils_1.TEST_CHAIN
      );
      expect(charts).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=charts.service.spec.js.map
