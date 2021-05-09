import { getDataMapper } from '../aws/dynamodb.utils';
import { CachedBoost } from '../leaderboards/interface/cached-boost.interface';
import { LeaderBoardsService } from '../leaderboards/leaderboards.service';

export const indexBoostLeaderBoard = async (): Promise<void> => {
  const boosts: CachedBoost[] = await LeaderBoardsService.generateBoostsLeaderBoard();
  const mapper = getDataMapper();
  await mapper.batchPut(boosts);
  // for await (const item of mapper.batchPut(boosts)) {
  //   console.log(item);
  // }
};
