import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import { LeaderBoardsService } from './leaderboards.service';

@Controller('/leaderboards')
export class LeaderBoardsController {
  @Inject()
  leaderBoardsService!: LeaderBoardsService;

  @ContentType('json')
  @Get('/complete')
  async getFullLeaderBoard(): Promise<Pick<LeaderBoardData, 'data'>> {
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
