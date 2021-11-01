import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Hidden, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderBoardDataModel } from './interface/leaderboard-data-model.interrface';
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
  @ContentType('json')
  @Summary('Get a page of the badger boost leaderboard')
  @Description('Return the requested page of the boost leaderboard')
  @Returns(200, LeaderBoardDataModel)
  async getLeaderBoard(
    @QueryParams('page') page?: number,
    @QueryParams('size') size?: number,
    @QueryParams('chain') chain?: Network,
  ): Promise<LeaderBoardDataModel> {
    return this.leaderBoardsService.loadLeaderboardEntries(Chain.getChain(chain), page, size);
  }
}
