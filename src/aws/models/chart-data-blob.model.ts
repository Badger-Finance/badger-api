import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ChartTimeFrame } from '../../charts/enums/chart-timeframe.enum';
import { ChartData } from '../../charts/chart-data.model';
import { CHART_DATA } from '../../config/constants';

@table(CHART_DATA)
export class ChartDataBlob<T extends ChartData> {
  @hashKey()
  id!: string;

  @attribute()
  timeframe!: ChartTimeFrame;

  @attribute({ memberType: { type: 'Any' } })
  data!: Array<T>;
}
