import { Controller, Inject } from '@tsed/di';
import { ContentType, Description, Get, Returns, Summary } from '@tsed/schema';

import { ProtocolMetrics } from './interfaces/metrics.interface';
import { ProtocolMetricModel } from './interfaces/protocol-metric-model';
import { MetricsService } from './metrics.service';

@Controller('/metrics')
export class MetricsController {
  @Inject()
  metricsService!: MetricsService;

  @Get('')
  @ContentType('json')
  @Summary('Get a metric of the protocol across all chains')
  @Description('Returns the total amount of users, total amount of vaults and total value locked across all chains')
  @Returns(200, ProtocolMetricModel)
  @Returns(404).Description('Protocol metrics not available')
  async getProtocolMetrics(): Promise<ProtocolMetrics> {
    return this.metricsService.getProtocolMetrics();
  }
}
