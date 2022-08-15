import { BadgerTypeMap, LeaderboardSummary } from '@badger-dao/sdk';
import { Service } from '@tsed/common';

import { Chain } from '../chains/config/chain.config';
import { queryLeaderboardSummary } from './leaderboards.utils';

@Service()
export class LeaderBoardsService {
  async fetchLeaderboardSummary(chain: Chain): Promise<LeaderboardSummary> {
    const cachedSummary = await queryLeaderboardSummary(chain);
    const summary = Object.fromEntries(
      cachedSummary.rankSummaries.map((s) => [s.badgerType, s.amount])
    ) as BadgerTypeMap;
    return {
      summary,
      updatedAt: cachedSummary.updatedAt
    };
  }
}
