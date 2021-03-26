import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { HarvestFragment } from '../graphql/generated/badger-dao';
import { HarvestsQueryDTO } from './dto/harvests-query.dto';
import { HarvestsService } from './harvests.service';

@Controller('/harvests')
export class HarvestsController {
  constructor(private harvestsService: HarvestsService) {}

  @Get()
  @ContentType('json')
  async listHarvests(@QueryParams() query: HarvestsQueryDTO): Promise<HarvestFragment[]> {
    const { harvests } = await this.harvestsService.listHarvests(query);
    return harvests;
  }
}
