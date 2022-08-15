import { LeaderboardSummary } from "@badger-dao/sdk";
import { Chain } from "../chains/config/chain.config";
export declare class LeaderBoardsService {
  fetchLeaderboardSummary(chain: Chain): Promise<LeaderboardSummary>;
}
