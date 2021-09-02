import { Controller, Get, Inject } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
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
  @(Returns(404).Description('Protocol metrics not available'))
  async getProtocolMetrics() {
    return this.metricsService.getProtocolMetrics();
  }
}
