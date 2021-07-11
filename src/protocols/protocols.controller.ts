import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { SettModel } from '../setts/interfaces/sett-model.interface';
import { SettsService } from '../setts/setts.service';
import { ProtocolSummary } from './interfaces/protocol-summary.interface';

@Controller('/')
export class ProtocolController {
  @Inject()
  settsService!: SettsService;

  @Get('/value')
  @ContentType('json')
  @Summary('Get a summary of protocol metrics')
  @Description('Return a summary of protocol metrics in currency value')
  @Returns(200, SettModel)
  @(Returns(400).Description('Not a valid chain'))
  async getAssetsUnderManagement(
    @QueryParams('chain') chain?: ChainNetwork,
    @QueryParams('currency') currency?: string,
  ): Promise<ProtocolSummary> {
    return this.settsService.getProtocolSummary(Chain.getChain(chain), currency);
  }
}
