import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { VaultsService } from '../vaults/vaults.service';
import { ProtocolSummaryModel } from './interfaces/protocol-summary-model.interface';

@Controller('/')
export class ProtocolController {
  @Inject()
  vaultsService!: VaultsService;

  @Get('/value')
  @ContentType('json')
  @Summary('Get a summary of protocol metrics')
  @Description('Return a summary of protocol metrics in currency value')
  @Returns(200, ProtocolSummaryModel)
  @Returns(400).Description('Not a valid chain')
  async getAssetsUnderManagement(
    @QueryParams('chain') chain?: Network,
    @QueryParams('currency') currency?: string,
  ): Promise<ProtocolSummaryModel> {
    return this.vaultsService.getProtocolSummary(Chain.getChain(chain), currency);
  }
}
