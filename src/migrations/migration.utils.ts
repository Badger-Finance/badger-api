import { ChartTimeFrame, ONE_DAY_MS } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { ChartDataBlob } from '../aws/models/chart-data-blob.model';
import { MigrationProcessData } from '../aws/models/migration-process.model';
import { ChartData } from '../charts/chart-data.model';
import { shouldUpdate, toChartDataBlob, toChartDataKey } from '../charts/charts.utils';

export async function getMigrationData(id: string) {
  const mapper = getDataMapper();

  let data = null;

  for await (const item of mapper.query(MigrationProcessData, { id }, { limit: 1 })) {
    data = item;
  }

  return data;
}

export function checkTimeframeCondition(timestamp: number, timeframe: ChartTimeFrame): boolean {
  const difference = Date.now() - timestamp;

  let update;
  switch (timeframe) {
    case ChartTimeFrame.Year:
      update = difference <= ONE_DAY_MS * 365;
      break;
    case ChartTimeFrame.ThreeMonth:
      update = difference <= ONE_DAY_MS * 90;
      break;
    case ChartTimeFrame.Month:
      update = difference <= ONE_DAY_MS * 30;
      break;
    case ChartTimeFrame.Week:
      update = difference <= ONE_DAY_MS * 7;
      break;
    case ChartTimeFrame.Day:
      update = difference <= ONE_DAY_MS;
      break;
    case ChartTimeFrame.Max:
      update = true;
      break;
    case ChartTimeFrame.YTD:
      update = new Date(timestamp).getFullYear() === 2022;
      break;
    default:
      update = false;
  }
  return update;
}

export async function pushHistoricSnapshots<T extends ChartData<T>>(namespace: string, snapshot: T): Promise<number> {
  let updatedCount = 0;

  const mapper = getDataMapper();

  for (const timeframe of Object.values(ChartTimeFrame)) {
    const searchKey = Object.assign(new ChartDataBlob<T>(), {
      id: toChartDataKey(namespace, snapshot.id, timeframe),
    });

    let cachedChart: ChartDataBlob<T> | undefined;

    try {
      cachedChart = await mapper.get(searchKey);
    } catch (_) {
      cachedChart = undefined;
    }

    if (!cachedChart) {
      const blob = toChartDataBlob(searchKey.id, timeframe, []);
      console.log(`New chart blob created ${searchKey.id}`);
      try {
        cachedChart = await mapper.put(blob);
      } catch (err) {
        console.error(`Unable to save chart data for ${searchKey.id}`);
        continue;
      }
    }

    const { data } = cachedChart;

    const prevSnapshot = data[0];

    const inTimeFrameCondition = checkTimeframeCondition(snapshot.timestamp, timeframe);
    const frequencyGapMatch =
      !prevSnapshot || (prevSnapshot && shouldUpdate(snapshot.timestamp, prevSnapshot.timestamp, timeframe));

    if (inTimeFrameCondition && frequencyGapMatch) {
      cachedChart.data.unshift(snapshot);
      try {
        await mapper.put(cachedChart);
      } catch (err) {
        console.error({ message: 'Unable to save blob', err });
      }
      updatedCount++;
    }
  }

  return updatedCount;
}
