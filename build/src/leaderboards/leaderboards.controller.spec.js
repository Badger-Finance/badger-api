"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const Server_1 = require("../Server");
const leaderboards_service_1 = require("./leaderboards.service");
describe("LeaderBoardsController", () => {
  let request;
  let service;
  beforeEach(common_1.PlatformTest.bootstrap(Server_1.Server));
  beforeEach(async () => {
    request = (0, supertest_1.default)(common_1.PlatformTest.callback());
    service = common_1.PlatformTest.get(leaderboards_service_1.LeaderBoardsService);
    jest.spyOn(service, "fetchLeaderboardSummary").mockImplementation(async (chain) => {
      const multiplier = Number(chain.chainId);
      return {
        summary: {
          [sdk_1.BadgerType.Basic]: multiplier * 1000,
          [sdk_1.BadgerType.Neo]: multiplier * 20,
          [sdk_1.BadgerType.Hero]: multiplier * 35,
          [sdk_1.BadgerType.Hyper]: multiplier * 25,
          [sdk_1.BadgerType.Frenzy]: multiplier * 40
        },
        updatedAt: 133742069
      };
    });
  });
  afterEach(common_1.PlatformTest.reset);
  describe("GET /v2/leaderboards", () => {
    describe("with no specified chain", () => {
      it("returns the ethereum leaderboard", async (done) => {
        const { body } = await request.get("/v2/leaderboards").expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe("with a specified chain", () => {
      it("returns the specified chain leaderboard", async (done) => {
        const { body } = await request.get("/v2/leaderboards?chain=arbitrum").expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
//# sourceMappingURL=leaderboards.controller.spec.js.map
