import { Controller, Get } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Sett } from '../interface/Sett';
import { GeyserService } from './GeysersService';

@Controller('/geysers')
export class GeyserController {
	constructor(private geyserService: GeyserService) {}

	@Get()
	@ContentType('json')
	async listFarms(): Promise<Sett[]> {
		return this.geyserService.listFarms();
	}
}
