import { BadgerType } from '@badger-dao/sdk';

import { getDataMapper, getLeaderboardKey } from '../aws/dynamodb.utils';
import { CachedLeaderboardSummary } from '../aws/models/cached-leaderboard-summary.model';
import { Chain } from '../chains/config/chain.config';

export async function queryLeaderboardSummary(chain: Chain): Promise<CachedLeaderboardSummary> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedLeaderboardSummary,
    {
      leaderboard: getLeaderboardKey(chain.network)
    },
    { limit: 1 }
  )) {
    return entry;
  }
  return {
    leaderboard: getLeaderboardKey(chain.network),
    rankSummaries: [
      {
        badgerType: BadgerType.Basic,
        amount: 0
      },
      {
        badgerType: BadgerType.Neo,
        amount: 0
      },
      {
        badgerType: BadgerType.Hero,
        amount: 0
      },
      {
        badgerType: BadgerType.Hyper,
        amount: 0
      },
      {
        badgerType: BadgerType.Frenzy,
        amount: 0
      }
    ],
    updatedAt: Date.now()
  };
}
