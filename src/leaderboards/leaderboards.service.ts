import { Service } from '@tsed/common';
import { ethers } from 'ethers';
import { getBoostFile } from '../accounts/accounts.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import { UserBoost } from './interface/user-boost.interface';
import { getFullLeaderBoard, getLeaderBoardEntryRange, getLeaderBoardSize } from './leaderboards.utils';

@Service()
export class LeaderBoardsService {
  async loadFullLeaderBoard(chain: Chain): Promise<CachedBoost[]> {
    return getFullLeaderBoard(chain);
  }

  async loadLeaderboardEntries(chain: Chain, page?: number, size?: number): Promise<LeaderBoardData> {
    const pageNumber = page || 0;
    const pageSize = size || 20;
    const offset = pageNumber > 0 ? 1 : 0;
    const start = pageNumber * pageSize + offset;
    const end = start + pageSize - offset;
    try {
      const [data, size] = await Promise.all([getLeaderBoardEntryRange(chain, start, end), getLeaderBoardSize(chain)]);
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

  static async generateBoostsLeaderBoard(): Promise<CachedBoost[]> {
    const chains = loadChains();
    const results = await Promise.all(chains.map((chain) => this.generateChainBoostsLeaderBoard(chain)));
    return results.flatMap((item) => item);
  }

  static async generateChainBoostsLeaderBoard(chain: Chain): Promise<CachedBoost[]> {
    try {
      const boostFile = await getBoostFile(chain);
      const boosts: UserBoost[] = Object.entries(boostFile.userData).map((entry) => {
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
            leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`,
            rank: i + 1,
            ...boost,
          });
        });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
