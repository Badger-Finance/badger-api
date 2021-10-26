import { Network } from '@badger-dao/sdk';
import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType, Hidden } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { HarvestFragment } from '../graphql/generated/badger';
import { HarvestsQueryDTO } from './dto/harvests-query.dto';
import { HarvestsService } from './harvests.service';

@Controller('/harvests')
export class HarvestsController {
  constructor(private harvestsService: HarvestsService) {}

  @Hidden()
  @Get()
  @ContentType('json')
  async listHarvests(
    @QueryParams() query: HarvestsQueryDTO,
    @QueryParams('chain') chain?: Network,
  ): Promise<HarvestFragment[]> {
    const { settHarvests } = await this.harvestsService.listHarvests(Chain.getChain(chain), query);
    return settHarvests;
  }
}
