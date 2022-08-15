import { ChartTimeFrame, Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams, UseCache } from '@tsed/common';
import { ContentType } from '@tsed/schema';

import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { QueryParamError } from '../errors/validation/query.param.error';
import { ChartsService } from './charts.service';

@Controller('/charts')
export class ChartsController {
  @Inject()
  chartsService!: ChartsService;

  @UseCache()
  @Get('/vault')
  @ContentType('json')
  async loadVaultCharts(
    @QueryParams('address') address: string,
    @QueryParams('timeframe') timeframe = ChartTimeFrame.Day,
    @QueryParams('chain') chain?: Network
  ): Promise<HistoricVaultSnapshotModel[]> {
    if (!address) {
      throw new QueryParamError('address');
    }
    return this.chartsService.loadVaultChartData(address, timeframe, Chain.getChain(chain));
  }
}
