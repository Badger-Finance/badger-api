import { between } from '@aws/dynamodb-expressions';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { getLeaderboardKey } from '../indexers/leaderboard-indexer';
import { CachedBoost } from './interface/cached-boost.interface';
import { CachedLeaderboardSummary } from './interface/cached-leaderboard-summary.interface';

const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;

export async function getLeaderBoardEntryRange(chain: Chain, start: number, end: number): Promise<CachedBoost[]> {
  if (start > end) {
    throw new BadRequest(`Start entry (${start}) must be less than or equal to end (${end})`);
  }
  const mapper = getDataMapper();
  const data = [];
  for await (const boost of mapper.query(CachedBoost, {
    leaderboard: getLeaderboardKey(chain),
    rank: between(start, end),
  })) {
    boost.address = shortenAddress(boost.address);
    data.push(boost);
  }
  return data;
}

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
    rankSummaries: [],
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
    return entry.rank;
  }
  return 0;
}

export const getUserLeaderBoardRank = async (chain: Chain, accountId: string): Promise<number> => {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    { leaderboard: getLeaderboardKey(chain), address: ethers.utils.getAddress(accountId) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddress' },
  )) {
    return entry.rank;
  }
  return (await getLeaderBoardSize(chain)) + 1;
};
