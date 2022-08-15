"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const eth_config_1 = require("../chains/config/eth.config");
const tests_utils_1 = require("../test/tests.utils");
const leaderboards_service_1 = require("./leaderboards.service");
describe("leaderboards.service", () => {
  const chain = new eth_config_1.Ethereum();
  let service;
  beforeAll(async () => {
    await common_1.PlatformTest.create();
    service = common_1.PlatformTest.get(leaderboards_service_1.LeaderBoardsService);
  });
  afterEach(common_1.PlatformTest.reset);
  describe("fetchLeaderboardSummary", () => {
    it("returns the current leaderboard summary for the requested chain", async () => {
      (0, tests_utils_1.setupMapper)([
        {
          leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(chain),
          rankSummaries: [
            {
              badgerType: sdk_1.BadgerType.Basic,
              amount: 1000
            },
            {
              badgerType: sdk_1.BadgerType.Neo,
              amount: 20
            },
            {
              badgerType: sdk_1.BadgerType.Hero,
              amount: 35
            },
            {
              badgerType: sdk_1.BadgerType.Hyper,
              amount: 25
            },
            {
              badgerType: sdk_1.BadgerType.Frenzy,
              amount: 40
            }
          ],
          updatedAt: 133742069
        }
      ]);
      const result = await service.fetchLeaderboardSummary(chain);
      expect(result).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=leaderboards.service.spec.js.map
