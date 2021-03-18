import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { resolveChainQuery } from '../config/chain/chain';
import { ProtocolSummary } from '../interface/ProtocolSummary';
import { SettsService } from '../setts/SettsService';

@Controller('/')
export class ProtocolController {
  @Inject()
  settsService!: SettsService;

  @Get('/value')
  @ContentType('json')
  async getAssetsUnderManagement(
    @QueryParams('chain') chain?: string,
    @QueryParams('currency') currency?: string,
  ): Promise<ProtocolSummary> {
    return this.settsService.getProtocolSummary(resolveChainQuery(chain), currency);
  }
}
