import { ProtocolMetrics } from '@badger-dao/sdk';
import { Controller, Get } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';

import { ProtocolMetricModel } from './interfaces/protocol-metric-model';
import { queryProtocolMetrics } from './metrics.utils';

@Controller('/metrics')
export class MetricsController {
  @Get('')
  @ContentType('json')
  @Summary('Get a metric of the protocol across all chains')
  @Description('Returns the total amount of users, total amount of vaults and total value locked across all chains')
  @Returns(200, ProtocolMetricModel)
  @Returns(404).Description('Protocol metrics not available')
  async getProtocolMetrics(): Promise<ProtocolMetrics> {
    return queryProtocolMetrics();
  }
}
