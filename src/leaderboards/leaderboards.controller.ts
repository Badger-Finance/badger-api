import { LeaderboardSummary, Network } from "@badger-dao/sdk";
import { Controller, Get, Inject, QueryParams } from "@tsed/common";
import { ContentType, Hidden } from "@tsed/schema";

import { Chain } from "../chains/config/chain.config";
import { LeaderBoardsService } from "./leaderboards.service";

@Controller("/leaderboards")
export class LeaderBoardsController {
  @Inject()
  leaderBoardsService!: LeaderBoardsService;

  @Get("")
  @Hidden()
  @ContentType("json")
  async getLeaderBoardSummary(@QueryParams("chain") chain?: Network): Promise<LeaderboardSummary> {
    return this.leaderBoardsService.fetchLeaderboardSummary(Chain.getChain(chain));
  }
}
