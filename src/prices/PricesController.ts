import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { Network } from '../chains/enums/chain-network.enum';
import { PriceSummary } from '../tokens/interfaces/token-price.interface';
import { PricesService } from './PricesService';

@Controller('/prices')
export class PriceController {
  @Inject()
  pricesService!: PricesService;

  @ContentType('json')
  @Get('/')
  async listPrices(
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: string,
  ): Promise<PriceSummary> {
    return this.pricesService.getPriceSummary(Chain.getChain(chain), currency);
  }
}
