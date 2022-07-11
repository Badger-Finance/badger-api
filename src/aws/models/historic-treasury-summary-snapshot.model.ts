import { embed } from '@aws/dynamodb-data-mapper';
import { attribute } from '@aws/dynamodb-data-mapper-annotations';

import { ChartData } from '../../charts/chart-data.model';
import { CachedTreasuryPosition } from '../../treasury/interfaces/cached-treasury-position';
import { TreasurySummary } from '../../treasury/interfaces/treasury-summary.interface';

export class HistoricTreasurySummarySnapshot
  extends ChartData<HistoricTreasurySummarySnapshot>
  implements TreasurySummary
{
  static NAMESPACE = 'treasury';

  @attribute()
  id!: string;

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

  toBlankData(): HistoricTreasurySummarySnapshot {
    const copy = JSON.parse(JSON.stringify(this));
    copy.value = 0;
    copy.yield = 0;
    copy.positions = [];
    return copy;
  }
}
