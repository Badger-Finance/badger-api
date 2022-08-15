import { LeaderboardRankSummary } from "../../leaderboards/interface/leaderboard-rank-summary.interface";
export declare class CachedLeaderboardSummary {
  leaderboard: string;
  rankSummaries: Array<LeaderboardRankSummary>;
  updatedAt: number;
}
