import { Controller, Get } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Sett } from '../interface/Sett';
import { GeyserService } from '../service/geyser/GeyserService';

@Controller('/protocol/geyser')
export class GeyserController {
	constructor(private geyserService: GeyserService) {}

	@Get()
	@ContentType('json')
	async listFarms(): Promise<Sett[]> {
		return this.geyserService.listFarms();
	}
}
