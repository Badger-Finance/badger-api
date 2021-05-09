import { getDataMapper } from "../aws/dynamodb.utils";
import { BoostsService } from "../boosts/boosts.service"
import { CachedBoost } from "../boosts/interface/cached-boost.interface";

export const indexBoostLeaderBoard = async (): Promise<void> => {
  const boosts: CachedBoost[] = await BoostsService.generateBoostsLeaderBoard();
  const mapper = getDataMapper();
  await mapper.batchPut(boosts);
}