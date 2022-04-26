import { CitadelTreasurySummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-treasury-summary.interface';
import { CitadelTreasurySummaryModel } from './interfaces/citadel-treasury-summary-model.interface';

import { CitadelService } from './citadel.service';

import { Controller, Get, Inject, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Summary, Returns, Description } from '@tsed/schema';
import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { CitadelRewardEventModel } from './interfaces/citadel-reward-event-model.interface';
import { CitadelRewardEvent } from './interfaces/citadel-reward-event.interface';

@Controller('/')
export class CitadelController {
  @Inject()
  citadelService!: CitadelService;

  @UseCache()
  @Get('/treasury')
  @ContentType('json')
  @Summary('Citadel DAO Treasury Allocation and Metrics')
  @Description('Returns specific treasury metrics, positions, and yield')
  @Returns(200, CitadelTreasurySummaryModel)
  async loadCitadelTreasury(): Promise<CitadelTreasurySummary> {
    return this.citadelService.loadTreasurySummary();
  }

  @Get('/rewards')
  @ContentType('json')
  @Summary('Added/paid rewards list')
  @Description('List of reward events')
  @Returns(200, Array).Of(CitadelRewardEventModel)
  @Returns(400).Description('Token should be specified')
  @Returns(400).Description('User or token param is missing')
  async loadRewardsList(
    @QueryParams('token') token: string,
    @QueryParams('user') user?: string,
    @QueryParams('filter') filter?: RewardFilter,
  ): Promise<CitadelRewardEvent[]> {
    return this.citadelService.getListRewards(token, user, filter);
  }
}
