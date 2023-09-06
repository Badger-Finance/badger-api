import { Network } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { ProtocolMetricSnapshot } from '../aws/models/protocol-metric-snapshot.model';
import { getSupportedChains } from '../chains/chains.utils';
import { MetricType } from '../metrics/enums/metric-type';
import { getChainMetrics } from '../metrics/metrics.utils';
import { rfw } from '../utils/retry.utils';

export const indexProtocolMetrics = async () => {
  const mapper = getDataMapper();
  const metric = await rfw(getChainMetrics)(getSupportedChains([Network.Ethereum]));
  const metricSnapshot = Object.assign(new ProtocolMetricSnapshot(), { ...metric, type: MetricType.Protocol });

  try {
    await mapper.put(metricSnapshot);
  } catch (err) {
    console.error({ err, metricSnapshot });
  }

  return 'done';
};
