import { ChartDataBlob } from '../aws/models/chart-data-blob.model';
import { ChartTimeFrame } from './enums/chart-timeframe.enum';

export function toChartDataBlob<T>(id: string, data: T[]): ChartDataBlob<T> {
  return Object.assign(new ChartDataBlob(), {
    id,
    data,
  });
}

export function toChartDataKey(namespace: string, id: string, timeframe: ChartTimeFrame): string {
  return [namespace, id, timeframe].join('_');
}
