import { CachedLeaderboardSummary } from '../aws/models/cached-leaderboard-summary.model';
import { Chain } from '../chains/config/chain.config';
export declare function queryLeaderboardSummary(chain: Chain): Promise<CachedLeaderboardSummary>;
