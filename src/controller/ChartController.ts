import { Controller, Get, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { SettSnapshot } from '../interface/SettSnapshot';
import { SettService } from '../setts/SettsService';

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
