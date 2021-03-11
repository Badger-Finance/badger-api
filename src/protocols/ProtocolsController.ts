import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { resolveChainQuery } from '../config/chain/chain';
import { ProtocolSummary } from '../interface/ProtocolSummary';
import { SettService } from '../setts/SettsService';

@Controller('/')
export class ProtocolController {
	@Inject()
	settService!: SettService;

	@Get('/value')
	@ContentType('json')
	async getAssetsUnderManagement(@QueryParams('chain') chain: string): Promise<ProtocolSummary> {
		return this.settService.getProtocolSummary(resolveChainQuery(chain));
	}
}
