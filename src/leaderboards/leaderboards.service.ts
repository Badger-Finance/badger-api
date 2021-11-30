import { Service } from '@tsed/common';
import { Chain } from '../chains/config/chain.config';
import { CachedBoost } from './interface/cached-boost.interface';
import { CachedLeaderboardSummary } from './interface/cached-leaderboard-summary.interface';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import {
  getFullLeaderBoard,
  getLeaderBoardEntryRange,
  getLeaderBoardSize,
  queryLeaderboardSummary,
} from './leaderboards.utils';

@Service()
export class LeaderBoardsService {
  async loadFullLeaderBoard(chain: Chain): Promise<CachedBoost[]> {
    return getFullLeaderBoard(chain);
  }

  async fetchLeaderboardSummary(chain: Chain): Promise<CachedLeaderboardSummary> {
    return queryLeaderboardSummary(chain);
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
}
