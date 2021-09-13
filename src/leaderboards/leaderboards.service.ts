import { Service } from '@tsed/common';
import { ethers } from 'ethers';
import { getObject } from '../aws/s3.utils';
import { REWARD_DATA } from '../config/constants';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { CachedSettBoost } from '../setts/interfaces/cached-sett-boost.interface';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import { UserBoost } from './interface/user-boost.interface';
import { getFullLeaderBoard, getLeaderBoardEntryRange, getLeaderBoardSize } from './leaderboards.utils';

type MultiplierMetrics = Record<string, Record<string, number>>;

@Service()
export class LeaderBoardsService {
  async loadFullLeaderBoard(): Promise<CachedBoost[]> {
    return getFullLeaderBoard();
  }

  async loadLeaderboardEntries(page?: number, size?: number): Promise<LeaderBoardData> {
    const pageNumber = page || 0;
    const pageSize = size || 20;
    const offset = pageNumber > 0 ? 1 : 0;
    const start = pageNumber * pageSize + offset;
    const end = start + pageSize - offset;
    try {
      const [data, size] = await Promise.all([getLeaderBoardEntryRange(start, end), getLeaderBoardSize()]);
      const maxPage = parseInt((size / pageSize).toString());
      return {
        data,
        page: pageNumber,
        size: pageSize,
        count: data.length,
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

  static async generateSettBoostData(): Promise<CachedSettBoost[]> {
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const boostData: BoostData = JSON.parse(boostFile.toString('utf-8'));
    const multiplierMetrics: MultiplierMetrics = {};
    Object.values(boostData.userData).map((entry) => {
      const { boost, multipliers } = entry;
      Object.entries(multipliers).forEach((e) => {
        if (!multiplierMetrics[e[0]]) {
          multiplierMetrics[e[0]] = {};
        }
        multiplierMetrics[e[0]][boost] = Math.min(e[1], multiplierMetrics[e[0]][boost]);
      });
    });
    return Object.entries(multiplierMetrics).flatMap((e) => {
      const [address, metrics] = e;
      return Object.entries(metrics).map((metric) => {
        const [boost, multiplier] = metric;

        return Object.assign(new CachedSettBoost(), {
          address,
          boost,
          multiplier,
        });
      });
    });
  }

  static async generateBoostsLeaderBoard(): Promise<CachedBoost[]> {
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const boostData: BoostData = JSON.parse(boostFile.toString('utf-8'));
    const boosts: UserBoost[] = Object.entries(boostData.userData).map((entry) => {
      const [address, userBoost] = entry;
      const { boost, stakeRatio, nftMultiplier, nativeBalance, nonNativeBalance } = userBoost;
      return {
        address: ethers.utils.getAddress(address),
        boost,
        stakeRatio,
        nftMultiplier,
        nativeBalance: nativeBalance || 0,
        nonNativeBalance: nonNativeBalance || 0,
      };
    });
    return boosts
      .sort((a, b) => {
        if (a.boost === b.boost) {
          return b.nativeBalance - a.nativeBalance;
        }
        return b.boost - a.boost;
      })
      .map((boost, i) => {
        return Object.assign(new CachedBoost(), {
          leaderboard: LeaderBoardType.BadgerBoost,
          rank: i + 1,
          ...boost,
        });
      });
  }
}
