import { Currency, Network } from '@badger-dao/sdk';
import { Controller, Inject } from '@tsed/di';
import { UseCache } from '@tsed/platform-cache';
import { QueryParams } from '@tsed/platform-params';
import { ContentType, Description, Get, Hidden, Returns, Summary } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';
import { PriceSnapshots } from '../tokens/interfaces/price-snapshots.interface';
import { PriceSummary } from '../tokens/interfaces/price-summary.interface';
import { PriceSummaryModel } from '../tokens/interfaces/price-summary-model.interface';
import { PricesService } from './prices.service';

@Controller('/prices')
export class PricesController {
  @Inject()
  pricesService!: PricesService;

  @Get('')
  @UseCache()
  @ContentType('json')
  @Summary('Get a summary of token prices related to the Badger Protocol')
  @Description('Return a map of checksum contract address to the currency value of the token')
  @Returns(200, PriceSummaryModel)
  async listPrices(
    @QueryParams('tokens') tokens?: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: Currency
  ): Promise<PriceSummary> {
    return this.pricesService.getPriceSummary(
      tokens?.split(',') ?? Object.keys(Chain.getChain(chain).tokens),
      currency
    );
  }

  @Get('/snapshots')
  @Hidden()
  @UseCache()
  @ContentType('json')
  async getPriceSnapshots(
    @QueryParams('tokens') tokens: string,
    @QueryParams('timestamps') timestamps: string,
    @QueryParams('currency') currency?: Currency
  ): Promise<PriceSnapshots> {
    return this.pricesService.getPriceSnapshots(
      tokens.split(','),
      timestamps.split(',').map((t) => Number(t)),
      currency
    );
  }
}
