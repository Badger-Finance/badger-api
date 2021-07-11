import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { SettsService } from '../setts/setts.service';
import { ProtocolSummaryModel } from './interfaces/protocol-summary-model.interface';

@Controller('/')
export class ProtocolController {
  @Inject()
  settsService!: SettsService;

  @Get('/value')
  @ContentType('json')
  @Summary('Get a summary of protocol metrics')
  @Description('Return a summary of protocol metrics in currency value')
  @Returns(200, ProtocolSummaryModel)
  @(Returns(400).Description('Not a valid chain'))
  async getAssetsUnderManagement(
    @QueryParams('chain') chain?: ChainNetwork,
    @QueryParams('currency') currency?: string,
  ): Promise<ProtocolSummaryModel> {
    return this.settsService.getProtocolSummary(Chain.getChain(chain), currency);
  }
}
