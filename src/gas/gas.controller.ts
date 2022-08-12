import { Network } from '@badger-dao/sdk';
import { Controller, Get, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';
import { GasPrices } from './interfaces/gas-prices.interface';
import { GasPricesModel } from './interfaces/gas-prices-model';

@Controller('/gas')
export class GasController {
  @Get('')
  @UseCache()
  @ContentType('json')
  @Summary('Get the current gas price')
  @Description('Returns the current gas price on the requested chain')
  @Returns(200, GasPricesModel)
  @Returns(404).Description('Chain gas prices not available')
  async getGasPrices(@QueryParams('chain') chain?: Network): Promise<GasPrices> {
    const targetChain = Chain.getChain(chain);
    return targetChain.getGasPrices();
  }
}
