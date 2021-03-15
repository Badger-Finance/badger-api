import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { PriceSummary } from '../interface/TokenPrice';
import { PricesService } from './PricesService';

@Controller('/prices')
export class PriceController {
  @Inject()
  pricesService!: PricesService;

  @ContentType('json')
  @Get('/')
  async listPrices(@QueryParams('currency') currency?: string): Promise<PriceSummary> {
    return this.pricesService.getPriceSummary(currency);
  }
}
