import { CitadelTreasurySummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-treasury-summary.interface';
import { Controller, Get, Inject, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Summary, Returns, Description } from '@tsed/schema';
import { HistoricTreasurySummarySnapshot } from '../aws/models/historic-treasury-summary-snapshot.model';
import { ChartTimeFrame } from '../charts/enums/chart-timeframe.enum';
import { TreasuryService } from '../treasury/treasury.service';
import { CitadelService } from './citadel.service';
import { CITADEL_TREASURY_ADDRESS } from './config/citadel-treasury.config';
import { CitadelTreasurySummaryModel } from './interfaces/citadel-treasury-summary-model.interface';
import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { CitadelRewardEventModel } from './interfaces/citadel-reward-event-model.interface';
import { CitadelRewardEvent } from './interfaces/citadel-reward-event.interface';

@Controller('/')
export class CitadelController {
  @Inject()
  citadelService!: CitadelService;

  @Inject()
  treasuryService!: TreasuryService;

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

  @UseCache()
  @Get('/history')
  @ContentType('json')
  async loadCitadelTreasuryCharts(
    @QueryParams('timeframe') timeframe = ChartTimeFrame.Day,
  ): Promise<HistoricTreasurySummarySnapshot[]> {
    return this.treasuryService.loadTreasuryChartData(CITADEL_TREASURY_ADDRESS, timeframe);
  }
}
