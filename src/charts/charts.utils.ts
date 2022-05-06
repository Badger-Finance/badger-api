import { ONE_DAY_MS, ONE_HOUR_MS } from '@badger-dao/sdk';
import { getDataMapper } from '../aws/dynamodb.utils';
import { ChartDataBlob } from '../aws/models/chart-data-blob.model';
import { ChartData } from './chart-data.model';
import { ChartTimeFrame } from './enums/chart-timeframe.enum';

export function toChartDataBlob<T extends ChartData>(
  id: string,
  timeframe: ChartTimeFrame,
  data: T[],
): ChartDataBlob<T> {
  return Object.assign(new ChartDataBlob(), {
    id,
    timeframe,
    data,
  });
}

export function toChartDataKey(namespace: string, id: string, timeframe: ChartTimeFrame): string {
  return [namespace, id, timeframe].join('_');
}

export function shouldUpdate(reference: number, timestamp: number, timeframe: ChartTimeFrame): boolean {
  const difference = reference - timestamp;
  let update = false;
  switch (timeframe) {
    case ChartTimeFrame.Max:
    case ChartTimeFrame.Year:
    case ChartTimeFrame.NineMonth:
    case ChartTimeFrame.SixMonth:
    case ChartTimeFrame.ThreeMonth:
    case ChartTimeFrame.Month:
      update = difference >= ONE_DAY_MS;
      break;
    case ChartTimeFrame.TwoWeek:
      update = difference >= ONE_HOUR_MS * 12;
      break;
    case ChartTimeFrame.Week:
      update = difference >= ONE_HOUR_MS * 6;
      break;
    default:
      update = difference >= ONE_HOUR_MS;
  }
  return update;
}

export function shouldTrim(reference: number, timestamp: number, timeframe: ChartTimeFrame): boolean {
  const difference = reference - timestamp;
  let update;
  switch (timeframe) {
    case ChartTimeFrame.Year:
      update = difference >= ONE_DAY_MS * 365;
      break;
    case ChartTimeFrame.NineMonth:
      update = difference >= ONE_DAY_MS * 270;
      break;
    case ChartTimeFrame.SixMonth:
      update = difference >= ONE_DAY_MS * 180;
      break;
    case ChartTimeFrame.ThreeMonth:
      update = difference >= ONE_DAY_MS * 90;
      break;
    case ChartTimeFrame.Month:
      update = difference >= ONE_DAY_MS * 30;
      break;
    case ChartTimeFrame.TwoWeek:
      update = difference >= ONE_DAY_MS * 14;
      break;
    case ChartTimeFrame.Week:
      update = difference >= ONE_DAY_MS * 7;
      break;
    case ChartTimeFrame.Day:
      update = difference >= ONE_DAY_MS;
      break;
    default:
      update = false;
  }
  return update;
}

export async function updateSnapshots<T extends ChartData>(namespace: string, snapshot: T) {
  const mapper = getDataMapper();

  const { id, timestamp: now } = snapshot;
  for (const timeframe of Object.values(ChartTimeFrame)) {
    const searchKey = Object.assign(new ChartDataBlob<T>(), {
      id: toChartDataKey(namespace, id, timeframe),
    });

    let cachedChart: ChartDataBlob<T> | undefined;
    try {
      cachedChart = await mapper.get(searchKey);
    } catch {} // no item found

    let updateCache = false;
    if (!cachedChart) {
      const blob = toChartDataBlob(searchKey.id, timeframe, []);
      try {
        console.log(`Create blob for ${searchKey.id}`);
        cachedChart = await mapper.put(blob);
        console.log(cachedChart);
      } catch (err) {
        console.error({ message: 'Unable to save blob', err });
      }
      updateCache = true;
    } else {
      const { timeframe, data } = cachedChart;
      const recentSnapshot = data[0].timestamp;
      updateCache = shouldUpdate(now, recentSnapshot, timeframe);

      const lastSnapshot = data[data.length - 1].timestamp;
      if (shouldTrim(now, lastSnapshot, timeframe)) {
        cachedChart.data = cachedChart.data.slice(0, data.length - 1);
      }
    }

    if (updateCache && cachedChart) {
      cachedChart.data.splice(0, 0, snapshot);
      try {
        console.log(`Update ${searchKey.id} (${cachedChart.data.length} entries)`);
        await mapper.put(cachedChart);
      } catch (err) {
        console.error({ message: 'Unable to save blob', err });
      }
    }
  }
}
