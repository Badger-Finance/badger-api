"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const tests_utils_1 = require("../test/tests.utils");
const leaderboards_utils_1 = require("./leaderboards.utils");
describe("leaderboards.utils", () => {
  describe("queryLeaderboardSummary", () => {
    describe("no saved leaderboard summary data", () => {
      it("returns a map of all badger ranks with zero entries", async () => {
        (0, tests_utils_1.setupMapper)([]);
        const result = await (0, leaderboards_utils_1.queryLeaderboardSummary)(tests_utils_1.TEST_CHAIN);
        // result date will always update due to nature of function
        result.updatedAt = 133742069;
        expect(result).toMatchSnapshot();
      });
    });
    describe("saved leaderboard summary data", () => {
      it("returns the appropriate TEST_CHAIN summary data", async () => {
        (0, tests_utils_1.setupMapper)([
          {
            leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(tests_utils_1.TEST_CHAIN),
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
        const result = await (0, leaderboards_utils_1.queryLeaderboardSummary)(tests_utils_1.TEST_CHAIN);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
//# sourceMappingURL=leaderboards.utils.spec.js.map
