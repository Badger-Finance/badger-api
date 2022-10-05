import { ChartTimeFrame, ONE_DAY_MS, ONE_HOUR_MS } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { ChartDataBlob } from '../aws/models/chart-data-blob.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { ChartData } from './chart-data.model';

// list of ChartTimeFrame enums that contain unique capture granularities for searching
export const CHART_GRANULARITY_TIMEFRAMES = [ChartTimeFrame.Max, ChartTimeFrame.Week, ChartTimeFrame.Day];

/**
 * Converts array of data to a timeframe associated data blob.
 * @param id id to associate the blob to
 * @param timeframe timeframe to associate the blob to
 * @param data data to include within the data blob
 * @returns namespace and timeframe asscoiated data blob
 */
export function toChartDataBlob<T extends ChartData>(
  id: string,
  timeframe: ChartTimeFrame,
  data: T[],
): ChartDataBlob<T> {
  const blob: ChartDataBlob<T> = {
    id,
    timeframe,
    data,
  };
  return Object.assign(new ChartDataBlob(), blob);
}

/**
 * Utilize input parameters to create a blob data key.
 * @param namespace blob data namespace association
 * @param id blob entity id
 * @param timeframe blob timeframe association
 * @returns data key representing the mapping for the namespace, id and timeframe association
 */
export function toChartDataKey(namespace: string, id: string, timeframe: ChartTimeFrame): string {
  return [namespace, id, timeframe].join('_');
}

/**
 * Identify if a data blob requires or should have new data pushed into it.
 * @param reference the reference (current) timestamp
 * @param timestamp the previous timestamp
 * @param timeframe the timeframe we are measuring against
 * @returns true if the blob should be updated, false if not
 */
export function shouldUpdate(reference: number, timestamp: number, timeframe: ChartTimeFrame): boolean {
  const difference = reference - timestamp;
  let update = false;
  switch (timeframe) {
    case ChartTimeFrame.Max:
    case ChartTimeFrame.Year:
    case ChartTimeFrame.ThreeMonth:
    case ChartTimeFrame.Month:
    case ChartTimeFrame.YTD:
      update = difference >= ONE_DAY_MS;
      break;
    case ChartTimeFrame.Week:
      update = difference >= ONE_HOUR_MS * 6;
      break;
    default:
      update = difference >= ONE_HOUR_MS;
  }
  return update;
}

/**
 * Identify if a data blob requires or should have old data dropped from it.
 * @param reference the reference (current) timestamp
 * @param timestamp the previous timestamp
 * @param timeframe the timeframe we are measuring against
 * @returns true if the blob should be updated, false if not
 */
export function shouldTrim(reference: number, timestamp: number, timeframe: ChartTimeFrame): boolean {
  const difference = reference - timestamp;
  let update;
  switch (timeframe) {
    case ChartTimeFrame.Year:
      update = difference >= ONE_DAY_MS * 365;
      break;
    case ChartTimeFrame.ThreeMonth:
      update = difference >= ONE_DAY_MS * 90;
      break;
    case ChartTimeFrame.Month:
      update = difference >= ONE_DAY_MS * 30;
      break;
    case ChartTimeFrame.Week:
      update = difference >= ONE_DAY_MS * 7;
      break;
    case ChartTimeFrame.Day:
      update = difference >= ONE_DAY_MS;
      break;
    // Year to date needs a full clear - so we will never trim
    case ChartTimeFrame.YTD:
    default:
      update = false;
  }
  return update;
}

/**
 * Identify and update all time frame data blobs that a given snapshot is elligible for.
 * @param namespace blob namespace to query and iterate over
 * @param snapshot snapshot to insert into elligible blobs
 */
export async function updateSnapshots<T extends ChartData>(namespace: string, snapshot: T) {
  const mapper = getDataMapper();
  const isFirstOfYear = (date: Date) => date.getDay() === 0 && date.getMonth() === 0;

  const { id, timestamp: now } = snapshot;
  for (const timeframe of Object.values(ChartTimeFrame)) {
    const searchKey = Object.assign(new ChartDataBlob<T>(), {
      id: toChartDataKey(namespace, id, timeframe),
    });

    let cachedChart: ChartDataBlob<T> | undefined;
    try {
      cachedChart = await mapper.get(searchKey);
      if (timeframe === ChartTimeFrame.YTD) {
        const date = new Date(now);
        if (isFirstOfYear(date) && cachedChart.data.length > 1) {
          // new year, force a new object to be created
          cachedChart = undefined;
        }
      }
    } catch (err) {
      console.debug({ message: 'Unable to query cached chart, may simply not exist', err });
    } // no item found

    let updateCache = false;
    if (!cachedChart) {
      const blob = toChartDataBlob(searchKey.id, timeframe, []);
      console.debug(`Create blob for ${searchKey.id}`);
      try {
        cachedChart = await mapper.put(blob);
        updateCache = true;
      } catch (err) {
        console.error({ message: 'Unable to save blob', err });
      }
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
      console.debug(`Update ${searchKey.id} (${cachedChart.data.length} entries)`);
      try {
        await mapper.put(cachedChart);
      } catch (err) {
        console.error({ message: 'Unable to save blob', err });
      }
    }
  }
}

/**
 * Query vault chart information.
 * @param id blob data key
 * @returns data associated with the chart data blob
 */
export async function queryVaultCharts(id: string): Promise<HistoricVaultSnapshotModel[]> {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(ChartDataBlob, { id }, { limit: 1, scanIndexForward: false })) {
      return <HistoricVaultSnapshotModel[]>item.data;
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
