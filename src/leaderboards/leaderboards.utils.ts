import { between } from '@aws/dynamodb-expressions';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';

export const getLeaderBoardEntryRange = async (start: number, end: number): Promise<CachedBoost[]> => {
  if (start > end) {
    throw new BadRequest(`Start entry (${start}) must be less than or equal to end (${end})`);
  }
  const mapper = getDataMapper();
  const data = [];
  for await (const boost of mapper.query(CachedBoost, {
    leaderboard: LeaderBoardType.BadgerBoost,
    rank: between(start, end),
  })) {
    boost.address = `${boost.address.slice(0, 6)}...${boost.address.slice(boost.address.length - 4)}`;
    data.push(boost);
  }
  return data;
};

export const getLeaderBoardSize = async (): Promise<number> => {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    {
      leaderboard: LeaderBoardType.BadgerBoost,
    },
    { limit: 1, scanIndexForward: false },
  )) {
    return entry.rank;
  }
  return 0;
};

export const getUserLeaderBoardRank = async (accountId: string): Promise<number> => {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    { address: ethers.utils.getAddress(accountId) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddress' },
  )) {
    return entry.rank;
  }
  return (await getLeaderBoardSize()) + 1;
};
