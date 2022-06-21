import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { TREASURY_SNAPSHOT_DATA } from '../../config/constants';
import { CachedTreasuryPosition } from '../../treasury/interfaces/cached-treasury-position';
import { TreasurySummary } from '../../treasury/interfaces/treasury-summary.interface';

@table(TREASURY_SNAPSHOT_DATA)
export class TreasurySummarySnapshot implements TreasurySummary {
  @hashKey()
  address!: string;

  @attribute()
  value!: number;

  @attribute()
  yield!: number;

  @attribute({ memberType: embed(CachedTreasuryPosition) })
  positions!: CachedTreasuryPosition[];
}
