import { Controller, Get, PathParams, QueryParams } from '@tsed/common';
import { SettService } from '../service/sett/SettService';
import { SettSnapshot } from '../interface/SettSnapshot';
import { ContentType } from '@tsed/schema';

@Controller('/chart/sett')
export class ChartController {
	constructor(private settService: SettService) {}

	@Get('/:settName')
	@ContentType('json')
	getApiLinks(
		@PathParams('settName') settName: string,
		@QueryParams('count') count?: number,
	): Promise<SettSnapshot[]> {
		return this.settService.getSettSnapshots(settName, count);
	}
}
