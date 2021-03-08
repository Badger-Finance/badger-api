import { Controller, Get, PathParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Sett } from '../interface/Sett';
import { SettService } from './SettsService';

@Controller('/setts')
export class SettController {
	constructor(private settService: SettService) {}

	@Get()
	@ContentType('json')
	async listSetts(): Promise<Sett[]> {
		return this.settService.listSetts();
	}

	@Get('/:settName')
	@ContentType('json')
	async getSett(@PathParams('settName') settName: string): Promise<Sett> {
		return this.settService.getSett(settName);
	}
}
