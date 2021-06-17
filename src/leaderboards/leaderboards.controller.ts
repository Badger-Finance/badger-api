import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import { LeaderBoardsService } from './leaderboards.service';
import { CachedBoost } from './interface/cached-boost.interface';

@Controller('/leaderboards')
export class LeaderBoardsController {
  @Inject()
  leaderBoardsService!: LeaderBoardsService;

  @ContentType('json')
  @Get('/complete')
  async getFullLeaderBoard(): Promise<CachedBoost[]> {
    return this.leaderBoardsService.loadFullLeaderBoard();
  }

  @ContentType('json')
  @Get('')
  async getLeaderBoard(
    @QueryParams('page') page?: number,
    @QueryParams('size') size?: number,
  ): Promise<LeaderBoardData> {
    return this.leaderBoardsService.loadLeaderboardEntries(page, size);
  }
}
