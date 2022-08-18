import { getDataMapper } from '../aws/dynamodb.utils';
import { ProtocolMetricSnapshot } from '../aws/models/protocol-metric-snapshot.model';
import { getSupportedChains } from '../chains/chains.utils';
import { MetricType } from '../metrics/enums/metric-type';
import { getChainMetrics } from '../metrics/metrics.utils';

export const indexProtocolMetrics = async () => {
  const mapper = getDataMapper();
  const metric = await getChainMetrics(getSupportedChains());
  const metricSnapshot = Object.assign(new ProtocolMetricSnapshot(), { ...metric, type: MetricType.protocol });

  try {
    await mapper.put(metricSnapshot);
  } catch (err) {
    console.error({ err, metricSnapshot });
  }

  return 'done';
};
