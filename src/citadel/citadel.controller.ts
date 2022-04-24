import { Controller, Get, Inject, UseCache } from '@tsed/common';
import { ContentType, Summary, Returns, Description } from '@tsed/schema';
import { CitadelService } from './citadel.service';
import { CitadelTreasurySummary } from './interfaces';
import { CitadelTreasurySummaryModel } from './interfaces/citadel-treasury-summary-model.interface';

@Controller('/')
export class CitadelController {
  @Inject()
  citadelService!: CitadelService;

  @UseCache()
  @Get('/treasury')
  @ContentType('json')
  @Summary('Citadel DAO Treasury Allocation and Metrics')
  @Description('Returns specific treasury metrics, positions, and yield')
  @Returns(200, Array).Of(CitadelTreasurySummaryModel)
  async loadCitadelTreasury(): Promise<CitadelTreasurySummary> {
    return this.citadelService.loadTreasurySummary();
  }
}
