import { BadgerType, Network } from "@badger-dao/sdk";
import { PlatformTest } from "@tsed/common";
import { PlatformServerless } from "@tsed/platform-serverless";
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing";

import { Chain } from "../chains/config/chain.config";
import { NetworkStatus } from "../errors/enums/network-status.enum";
import { TEST_CURRENT_TIMESTAMP } from "../test/constants";
import { setupMockChain } from "../test/mocks.utils";
import { LeaderBoardsController } from "./leaderboards.controller";
import { LeaderBoardsService } from "./leaderboards.service";

describe("leaderboards.controller", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [LeaderBoardsController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(setupMockChain);

  beforeEach(async () => {
    jest.spyOn(LeaderBoardsService.prototype, "fetchLeaderboardSummary").mockImplementation(async (chain: Chain) => {
      const multiplier = Number(chain.chainId);
      return {
        summary: {
          [BadgerType.Basic]: multiplier * 1000,
          [BadgerType.Neo]: multiplier * 20,
          [BadgerType.Hero]: multiplier * 35,
          [BadgerType.Hyper]: multiplier * 25,
          [BadgerType.Frenzy]: multiplier * 40
        },
        updatedAt: TEST_CURRENT_TIMESTAMP
      };
    });
  });

  afterEach(PlatformTest.reset);

  describe("GET /leaderboards", () => {
    describe("with no specified chain", () => {
      it("returns the ethereum leaderboard", async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get("/leaderboards");
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe("with a specified chain", () => {
      it("returns the specified chain leaderboard", async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get("/leaderboards")
          .query({ chain: Network.Arbitrum });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
