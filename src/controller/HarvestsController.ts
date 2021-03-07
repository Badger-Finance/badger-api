import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { HarvestsQueryArgs } from '../args/HarvestsQueryArgs';
import { HarvestsService } from '../service/harvests/HarvestsService';

@Controller('/harvests')
export class HarvestsController {
	constructor(private harvestsService: HarvestsService) {}

	@Get()
	@ContentType('json')
	async listHarvests(@QueryParams() query: HarvestsQueryArgs): Promise<any> {
		return this.harvestsService.listHarvests(query);
	}
}
