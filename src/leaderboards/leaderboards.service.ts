import { BadgerType, LeaderboardSummary } from '@badger-dao/sdk';
import { Service } from '@tsed/di';

import { Chain } from '../chains/config/chain.config';
// import { queryLeaderboardSummary } from './leaderboards.utils';

@Service()
export class LeaderBoardsService {
  async fetchLeaderboardSummary(_chain: Chain): Promise<LeaderboardSummary> {
    // const cachedSummary = await queryLeaderboardSummary(chain);
    // const summary = Object.fromEntries(
    //   cachedSummary.rankSummaries.map((s) => [s.badgerType, s.amount]),
    // ) as BadgerTypeMap;
    // return {
    //   summary,
    //   updatedAt: cachedSummary.updatedAt,
    // };
    return {
      summary: {
        [BadgerType.Basic]: 0,
        [BadgerType.Neo]: 0,
        [BadgerType.Frenzy]: 0,
        [BadgerType.Hero]: 0,
        [BadgerType.Hyper]: 0,
      },
      updatedAt: 0,
    };
  }
}
