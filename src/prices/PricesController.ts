import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { resolveChainQuery } from '../config/chain/chain';
import { PriceSummary } from '../tokens/interfaces/token-price.interface';
import { PricesService } from './PricesService';

@Controller('/prices')
export class PriceController {
  @Inject()
  pricesService!: PricesService;

  @ContentType('json')
  @Get('/')
  async listPrices(
    @QueryParams('chain') chain: string,
    @QueryParams('currency') currency?: string,
  ): Promise<PriceSummary> {
    return this.pricesService.getPriceSummary(resolveChainQuery(chain), currency);
  }
}
