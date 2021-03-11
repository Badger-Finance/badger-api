import { Controller, Get, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { resolveChainQuery } from '../config/chain';
import { Sett } from '../interface/Sett';
import { SettService } from './SettsService';

@Controller('/setts')
export class SettsController {
	constructor(private settService: SettService) {}

	@Get()
	@ContentType('json')
	async listSetts(@QueryParams('chain') chain: string): Promise<Sett[]> {
		return this.settService.listSetts(resolveChainQuery(chain));
	}

	@Get('/:settName')
	@ContentType('json')
	async getSett(@PathParams('settName') settName: string, @QueryParams('chain') chain: string): Promise<Sett> {
		return this.settService.getSett(resolveChainQuery(chain), settName);
	}
}
