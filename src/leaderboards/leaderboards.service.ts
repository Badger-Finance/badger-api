import { between } from '@aws/dynamodb-expressions';
import { Service } from '@tsed/common';
import { getDataMapper } from '../aws/dynamodb.utils';
import { getObject } from '../aws/s3.utils';
import { REWARD_DATA } from '../config/constants';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';
import { UserBoost } from './interface/user-boost.interface';

@Service()
export class LeaderBoardsService {
  async loadLeaderboardEntries(page?: number, size?: number): Promise<CachedBoost[]> {
    const mapper = getDataMapper();
    const pageNumber = page || 0;
    const pageSize = size || 20;
    const start = pageNumber * pageSize;
    const end = start + pageSize;
    try {
      const boosts = [];
      for await (const snapshot of mapper.query(CachedBoost, {
        leaderboard: LeaderBoardType.BadgerBoost,
        // rangeKey: between(start, end),
      })) {
        boosts.push(snapshot);
      }
      return boosts;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  static async generateBoostsLeaderBoard(): Promise<CachedBoost[]> {
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const boostData: BoostData = JSON.parse(boostFile.toString('utf-8'));
    const boosts: UserBoost[] = Object.entries(boostData.userData).map((entry) => {
      const [address, userBoost] = entry;
      return {
        address,
        boost: userBoost.boost,
      };
    });
    return boosts
      .sort((a, b) => b.boost - a.boost)
      .map((boost, i) => {
        return Object.assign(new CachedBoost(), {
          leaderboard: LeaderBoardType.BadgerBoost,
          rank: i + 1,
          ...boost,
        });
      });
  }
}
