import { Service } from '@tsed/common';
import { getObject } from '../aws/s3.utils';
import { REWARD_DATA } from '../config/constants';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import { UserBoost } from './interface/user-boost.interface';
import { getLeaderBoardEntryRange, getLeaderBoardSize } from './leaderboards.utils';

@Service()
export class LeaderBoardsService {
  async loadLeaderboardEntries(page?: number, size?: number): Promise<LeaderBoardData> {
    const pageNumber = page || 0;
    const pageSize = size || 20;
    const offset = page ?? 1;
    const start = pageNumber * pageSize + offset;
    const end = start + pageSize - offset;
    try {
      const [data, size] = await Promise.all([getLeaderBoardEntryRange(start, end), getLeaderBoardSize()]);
      const maxPage = parseInt((size / pageSize).toString());
      return {
        data,
        page: pageNumber,
        size: pageSize,
        count: size,
        maxPage,
      };
    } catch (err) {
      console.error(err);
      return {
        data: [],
        page: 0,
        size: 0,
        count: 0,
        maxPage: 0,
      };
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
