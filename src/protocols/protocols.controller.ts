import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { SettsService } from '../setts/setts.service';
import { ProtocolSummary } from './interfaces/protocol-summary.interface';

@Controller('/')
export class ProtocolController {
  @Inject()
  settsService!: SettsService;

  @Get('/value')
  @ContentType('json')
  async getAssetsUnderManagement(
    @QueryParams('chain') chain?: ChainNetwork,
    @QueryParams('currency') currency?: string,
  ): Promise<ProtocolSummary> {
    return this.settsService.getProtocolSummary(Chain.getChain(chain), currency);
  }
}
