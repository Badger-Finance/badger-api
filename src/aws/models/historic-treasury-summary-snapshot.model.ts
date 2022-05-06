import { embed } from '@aws/dynamodb-data-mapper';
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { CachedTreasuryPosition } from '../../treasury/interfaces/cached-treasury-position';
import { TreasurySummary } from '../../treasury/interfaces/treasury-summary.interface';

export class HistoricTreasurySummarySnapshot implements TreasurySummary {
  @attribute()
  address!: string;

  @attribute()
  timestamp!: number;

  @attribute()
  value!: number;

  @attribute()
  yield!: number;

  @attribute({ memberType: embed(CachedTreasuryPosition) })
  positions!: CachedTreasuryPosition[];
}
