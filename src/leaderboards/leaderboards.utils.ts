import { BadgerType, BadgerTypeMap } from '@badger-dao/sdk';

import { getDataMapper, getLeaderboardKey } from '../aws/dynamodb.utils';
import { CachedLeaderboardSummary } from '../aws/models/cached-leaderboard-summary.model';
import { Chain } from '../chains/config/chain.config';

const BADGER_RANKS: BadgerTypeMap = {
  [BadgerType.Basic]: 1,
  [BadgerType.Neo]: 20,
  [BadgerType.Hero]: 200,
  [BadgerType.Hyper]: 600,
  [BadgerType.Frenzy]: 1400,
};

export async function queryLeaderboardSummary(chain: Chain): Promise<CachedLeaderboardSummary> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedLeaderboardSummary,
    {
      leaderboard: getLeaderboardKey(chain.network),
    },
    { limit: 1 },
  )) {
    return entry;
  }
  return {
    leaderboard: getLeaderboardKey(chain.network),
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

export function getBadgerType(score: number): BadgerType {
  if (score >= BADGER_RANKS[BadgerType.Frenzy]) {
    return BadgerType.Frenzy;
  }
  if (score >= BADGER_RANKS[BadgerType.Hyper]) {
    return BadgerType.Hyper;
  }
  if (score >= BADGER_RANKS[BadgerType.Hero]) {
    return BadgerType.Hero;
  }
  if (score >= BADGER_RANKS[BadgerType.Neo]) {
    return BadgerType.Neo;
  }
  return BadgerType.Basic;
}
