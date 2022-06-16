import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';
import { GasService } from './gas.service';
import { GasPrices } from './interfaces/gas-prices.interface';
import { GasPricesModel } from './interfaces/gas-prices-model';

@Controller('/gas')
export class GasController {
  @Inject()
  gasService!: GasService;

  @Get('')
  @ContentType('json')
  @Summary('Get the current gas price')
  @Description('Returns the current gas price on the requested chain')
  @Returns(200, GasPricesModel)
  @Returns(404).Description('Chain gas prices not available')
  async getGasPrices(@QueryParams('chain') chain?: Network): Promise<GasPrices> {
    return this.gasService.getGasPrices(Chain.getChain(chain));
  }
}
