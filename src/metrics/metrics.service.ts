import { Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';

import { getDataMapper } from '../aws/dynamodb.utils';
import { ProtocolMetricSnapshot } from '../aws/models/protocol-metric-snapshot.model';
import { MetricType } from './enums/metric-type';
import { ProtocolMetrics } from './interfaces/metrics.interface';

@Service()
export class MetricsService {
  async getProtocolMetrics(): Promise<ProtocolMetrics> {
    const mapper = getDataMapper();
    let result: ProtocolMetrics | undefined;

    try {
      for await (const metric of mapper.query(
        ProtocolMetricSnapshot,
        { type: MetricType.protocol },
        { scanIndexForward: false, limit: 1 },
      )) {
        result = metric;
      }
    } catch (error) {
      console.error(error);
      throw new NotFound('Protocol metrics not available');
    }

    if (!result) {
      throw new NotFound('Protocol metrics not available');
    }

    return result;
  }
}
