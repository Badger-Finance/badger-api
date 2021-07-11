import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { PriceSummary } from '../tokens/interfaces/price-summary.interface';
import { PriceSummaryModel } from '../tokens/interfaces/price-summary-model.interface';
import { PricesService } from './prices.service';

@Controller('/prices')
export class PriceController {
  @Inject()
  pricesService!: PricesService;

  @Get('')
  @ContentType('json')
  @Summary('Get a summary of token prices related to the Badger Protocol')
  @Description('Return a map of checksum contract address to the currency value of the token')
  @Returns(200, PriceSummaryModel)
  async listPrices(
    @QueryParams('chain') chain?: ChainNetwork,
    @QueryParams('currency') currency?: string,
  ): Promise<PriceSummary> {
    return this.pricesService.getPriceSummary(Chain.getChain(chain), currency);
  }
}
