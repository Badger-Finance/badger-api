import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { Network } from '../chains/enums/chain-network.enum';
import { Sett } from '../interface/Sett';
import { SettsService } from './SettsService';

@Controller('/setts')
export class SettsController {
  @Inject()
  settsService!: SettsService;

  @Get()
  @ContentType('json')
  async listSetts(@QueryParams('chain') chain?: Network, @QueryParams('currency') currency?: string): Promise<Sett[]> {
    return this.settsService.listSetts(Chain.getChain(chain), currency);
  }

  @Get('/:settName')
  @ContentType('json')
  async getSett(
    @PathParams('settName') settName: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: string,
  ): Promise<Sett> {
    return this.settsService.getSett(Chain.getChain(chain), settName, currency);
  }
}
