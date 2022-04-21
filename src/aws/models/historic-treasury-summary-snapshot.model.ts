import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { TREASURY_HISTORIC_DATA } from '../../config/constants';
import { CachedTreasuryPosition } from '../../treasury/interfaces/cached-treasury-position';
import { TreasurySummary } from '../../treasury/interfaces/treasury-summary.interface';

@table(TREASURY_HISTORIC_DATA)
export class HistoricTreasurySummarySnapshot implements TreasurySummary {
  @hashKey()
  address!: string;

  @rangeKey({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @attribute()
  value!: number;

  @attribute()
  yield!: number;

  @attribute({ memberType: embed(CachedTreasuryPosition) })
  positions!: CachedTreasuryPosition[];
}
