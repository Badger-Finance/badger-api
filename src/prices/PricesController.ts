import { Controller, Get } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { PriceSummary } from '../interface/TokenPrice';
import { PriceService } from './PricesService';

@Controller('/prices')
export class PriceController {
	constructor(private priceService: PriceService) {}

	@ContentType('json')
	@Get('/')
	async listPrices(): Promise<PriceSummary> {
		return this.priceService.getPriceSummary();
	}
}
