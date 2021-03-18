import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { resolveChainQuery } from '../config/chain/chain';
import { Sett } from '../interface/Sett';
import { SettsService } from './SettsService';

@Controller('/setts')
export class SettsController {
  @Inject()
  settsService!: SettsService;

  @Get()
  @ContentType('json')
  async listSetts(@QueryParams('chain') chain?: string, @QueryParams('currency') currency?: string): Promise<Sett[]> {
    return this.settsService.listSetts(resolveChainQuery(chain), currency);
  }

  @Get('/:settName')
  @ContentType('json')
  async getSett(
    @PathParams('settName') settName: string,
    @QueryParams('chain') chain?: string,
    @QueryParams('currency') currency?: string,
  ): Promise<Sett> {
    return this.settsService.getSett(resolveChainQuery(chain), settName, currency);
  }
}
