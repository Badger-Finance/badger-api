import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Hidden } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderboardSummary } from './interface/leaderboard-summary.interface';
import { LeaderBoardsService } from './leaderboards.service';

@Controller('/leaderboards')
export class LeaderBoardsController {
  @Inject()
  leaderBoardsService!: LeaderBoardsService;

  @Hidden()
  @ContentType('json')
  @Get('/complete')
  async getFullLeaderBoard(@QueryParams('chain') chain?: Network): Promise<CachedBoost[]> {
    return this.leaderBoardsService.loadFullLeaderBoard(Chain.getChain(chain));
  }

  @Get('')
  @Hidden()
  @ContentType('json')
  async getLeaderBoardSummary(@QueryParams('chain') chain?: Network): Promise<LeaderboardSummary> {
    return this.leaderBoardsService.fetchLeaderboardSummary(Chain.getChain(chain));
  }

  // TODO: Enable this if it is once again used, or remove by 2/1/2022
  // @Get('')
  // @ContentType('json')
  // @Summary('Get a page of the badger boost leaderboard')
  // @Description('Return the requested page of the boost leaderboard')
  // @Returns(200, LeaderBoardDataModel)
  // async getLeaderBoard(
  //   @QueryParams('page') page?: number,
  //   @QueryParams('size') size?: number,
  //   @QueryParams('chain') chain?: Network,
  // ): Promise<LeaderBoardDataModel> {
  //   return this.leaderBoardsService.loadLeaderboardEntries(Chain.getChain(chain), page, size);
  // }
}
