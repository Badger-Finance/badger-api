import { LeaderboardSummary, Network } from "@badger-dao/sdk";
import { LeaderBoardsService } from "./leaderboards.service";
export declare class LeaderBoardsController {
  leaderBoardsService: LeaderBoardsService;
  getLeaderBoardSummary(chain?: Network): Promise<LeaderboardSummary>;
}
