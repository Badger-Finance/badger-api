import { BadgerType } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getDataMapper, getLeaderboardKey } from '../aws/dynamodb.utils';
import { CachedBoost } from '../aws/models/cached-boost.model';
import { CachedLeaderboardSummary } from '../aws/models/cached-leaderboard-summary.model';
import { Chain } from '../chains/config/chain.config';

export async function queryLeaderboardSummary(chain: Chain): Promise<CachedLeaderboardSummary> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedLeaderboardSummary,
    {
      leaderboard: getLeaderboardKey(chain),
    },
    { limit: 1 },
  )) {
    return entry;
  }
  return {
    leaderboard: getLeaderboardKey(chain),
    rankSummaries: [
      {
        badgerType: BadgerType.Basic,
        amount: 0,
      },
      {
        badgerType: BadgerType.Neo,
        amount: 0,
      },
      {
        badgerType: BadgerType.Hero,
        amount: 0,
      },
      {
        badgerType: BadgerType.Hyper,
        amount: 0,
      },
      {
        badgerType: BadgerType.Frenzy,
        amount: 0,
      },
    ],
    updatedAt: Date.now(),
  };
}

export async function getLeaderBoardSize(chain: Chain): Promise<number> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    {
      leaderboard: getLeaderboardKey(chain),
    },
    { limit: 1, scanIndexForward: false },
  )) {
    return entry.boostRank;
  }
  return 0;
}

export async function getUserLeaderBoardRank(chain: Chain, accountId: string): Promise<number> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    { leaderboard: getLeaderboardKey(chain), address: ethers.utils.getAddress(accountId) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddress' },
  )) {
    return entry.boostRank;
  }
  const leaderboardSize = await getLeaderBoardSize(chain);
  return leaderboardSize + 1;
}
