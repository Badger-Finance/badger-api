import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { HarvestFragment } from '../graphql/generated/badger-dao';
import { HarvestsQueryArgs } from './args/HarvestsQueryArgs';
import { HarvestsService } from './HarvestsService';

@Controller('/harvests')
export class HarvestsController {
	constructor(private harvestsService: HarvestsService) {}

	@Get()
	@ContentType('json')
	async listHarvests(@QueryParams() query: HarvestsQueryArgs): Promise<HarvestFragment[]> {
		const { harvests } = await this.harvestsService.listHarvests(query);
		return harvests;
	}
}
