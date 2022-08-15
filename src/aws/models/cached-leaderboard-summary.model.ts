import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { LEADERBOARD_SUMMARY_DATA } from '../../config/constants';
import { LeaderboardRankSummary } from '../../leaderboards/interface/leaderboard-rank-summary.interface';

@table(LEADERBOARD_SUMMARY_DATA)
export class CachedLeaderboardSummary {
  @hashKey()
  leaderboard!: string;

  @attribute({ memberType: embed(LeaderboardRankSummary) })
  rankSummaries!: Array<LeaderboardRankSummary>;

  @attribute({ defaultProvider: () => Date.now() })
  updatedAt!: number;
}
