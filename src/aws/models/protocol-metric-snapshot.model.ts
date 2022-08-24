import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ProtocolMetrics } from '@badger-dao/sdk';

import { METRICS_SNAPSHOTS_DATA } from '../../config/constants';

@table(METRICS_SNAPSHOTS_DATA)
export class ProtocolMetricSnapshot implements ProtocolMetrics {
  @hashKey()
  type!: string;

  @rangeKey({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @attribute()
  totalUsers!: number;

  @attribute()
  totalVaults!: number;

  @attribute()
  totalValueLocked!: number;
}
