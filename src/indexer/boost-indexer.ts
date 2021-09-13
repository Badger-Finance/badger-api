import { getDataMapper } from '../aws/dynamodb.utils';
import { CachedBoost } from '../leaderboards/interface/cached-boost.interface';
import { LeaderBoardsService } from '../leaderboards/leaderboards.service';
import { CachedSettBoost } from '../setts/interfaces/cached-sett-boost.interface';

export const indexBoostLeaderBoard = async (): Promise<void> => {
  const boosts: CachedBoost[] = await LeaderBoardsService.generateBoostsLeaderBoard();
  const mapper = getDataMapper();
  for await (const _item of mapper.batchPut(boosts)) {
  }
};

export const indexSettBoosts = async (): Promise<void> => {
  const boosts: CachedSettBoost[] = await LeaderBoardsService.generateSettBoostData();

  // collect map of new entries there are records for
  const boostDistribution: Record<string, Set<number>> = {};
  boosts.forEach((cachedBoost) => {
    const { address, boost } = cachedBoost;
    if (!boostDistribution[address]) {
      boostDistribution[address] = new Set();
    }
    boostDistribution[address].add(boost);
  });

  const mapper = getDataMapper();

  // get old records, filter out those with corresponding new entries
  const oldItems = [];
  for await (const record of mapper.scan(CachedSettBoost)) {
    if (!boostDistribution[record.address].has(record.boost)) {
      oldItems.push(record);
    }
  }

  // remove records that are no longer valid
  for await (const _item of mapper.batchDelete(oldItems)) {
  }

  // update stored boost distributions
  for await (const _item of mapper.batchPut(boosts)) {
  }
};
