import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
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
  @Description('Returns the total amount of users, total amount of vaults and total value locked across all chains')
  @Returns(200, GasPricesModel)
  @(Returns(404).Description('Protocol metrics not available'))
  async getGasPrices(@QueryParams('chain') chain?: ChainNetwork): Promise<GasPrices> {
    return this.gasService.getGasPrices(Chain.getChain(chain));
  }
}
