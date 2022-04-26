import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ChartTimeFrame } from '../../charts/enums/chart-timeframe.enum';
import { CHART_DATA } from '../../config/constants';

@table(CHART_DATA)
export class ChartDataBlob<T> {
  @hashKey()
  id!: string;

  @attribute()
  timeframe!: ChartTimeFrame;

  @attribute({ memberType: { type: 'Any' } })
  data!: Array<T>;
}
