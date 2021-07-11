import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { SettModel } from './interfaces/sett-model.interface';
import { SettsService } from './setts.service';

@Controller('/setts')
export class SettsController {
  @Inject()
  settsService!: SettsService;

  @Get()
  @ContentType('json')
  @Summary('Get a list of protocol setts')
  @Description('Return a list of protocol setts for the requested chain')
  @Returns(200, SettModel)
  @(Returns(400).Description('Not a valid chain'))
  @(Returns(404).Description('Not a valid sett'))
  async listSetts(
    @QueryParams('chain') chain?: ChainNetwork,
    @QueryParams('currency') currency?: string,
  ): Promise<SettModel[]> {
    return this.settsService.listSetts(Chain.getChain(chain), currency);
  }

  @Get('/:contract')
  @ContentType('json')
  @Summary('Get a specific sett')
  @Description('Return a specific sett for the requested chain')
  @Returns(200, SettModel)
  @(Returns(400).Description('Not a valid chain'))
  @(Returns(404).Description('Not a valid sett'))
  async getSett(
    @PathParams('contract') contract: string,
    @QueryParams('chain') chain?: ChainNetwork,
    @QueryParams('currency') currency?: string,
  ): Promise<SettModel> {
    return this.settsService.getSett(Chain.getChain(chain), contract, currency);
  }
}
