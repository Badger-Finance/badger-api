import { between } from '@aws/dynamodb-expressions';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';

const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;

export async function getFullLeaderBoard(chain: Chain): Promise<CachedBoost[]> {
  const mapper = getDataMapper();
  const data = [];
  for await (const boost of mapper.query(CachedBoost, {
    leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`,
  })) {
    boost.address = shortenAddress(boost.address);
    data.push(boost);
  }
  return data;
}

export async function getLeaderBoardEntryRange(chain: Chain, start: number, end: number): Promise<CachedBoost[]> {
  if (start > end) {
    throw new BadRequest(`Start entry (${start}) must be less than or equal to end (${end})`);
  }
  const mapper = getDataMapper();
  const data = [];
  for await (const boost of mapper.query(CachedBoost, {
    leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`,
    rank: between(start, end),
  })) {
    boost.address = shortenAddress(boost.address);
    data.push(boost);
  }
  return data;
}

export async function getLeaderBoardSize(chain: Chain): Promise<number> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    {
      leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`,
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
    { leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`, address: ethers.utils.getAddress(accountId) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddress' },
  )) {
    return entry.rank;
  }
  return (await getLeaderBoardSize(chain)) + 1;
};
