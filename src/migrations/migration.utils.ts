import { ChartTimeFrame, ONE_DAY_MS } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { ChartDataBlob } from '../aws/models/chart-data-blob.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { MigrationProcessData } from '../aws/models/migration-process.model';
import { toChartDataKey } from '../charts/charts.utils';

export async function getMigrationData(id: string) {
  const mapper = getDataMapper();

  let data = null;

  for await (const item of mapper.query(MigrationProcessData, { id }, { limit: 1 })) {
    data = item;
  }

  return data;
}

export async function pushHistoricSnapshots(namespace: string, snapshot: HistoricVaultSnapshotModel): Promise<number> {
  let updatedCount = 0;

  const mapper = getDataMapper();

  const relevantMigrationTimeFrames = [
    ChartTimeFrame.ThreeMonth,
    ChartTimeFrame.Year,
    ChartTimeFrame.YTD,
    ChartTimeFrame.Max,
  ];

  for (const timeframe of relevantMigrationTimeFrames) {
    const searchKey = Object.assign(new ChartDataBlob<HistoricVaultSnapshotModel>(), {
      id: toChartDataKey(namespace, snapshot.id, timeframe),
    });

    let cachedChart: ChartDataBlob<HistoricVaultSnapshotModel> | undefined;

    try {
      cachedChart = await mapper.get(searchKey);
    } catch (err) {
      console.log({ message: 'Unable to query cached chart, may simply not exist', err });
      continue;
    }

    if (!cachedChart) continue;

    const { data } = cachedChart;

    const lastSnapshot = data[data.length - 1];

    const shouldPushByTimeGap = snapshot.timestamp - lastSnapshot.timestamp >= ONE_DAY_MS;

    if (!lastSnapshot.migrated || shouldPushByTimeGap) {
      cachedChart.data.push(snapshot);

      if (lastSnapshot.migrated) {
        // we should swap append data with last elemnt to keep ascending order
        // for migrated elements, and save order for data that is gathering now
        const dataLength = cachedChart.data.length;
        const lastItemIx = dataLength - 1;
        const preLastItemIx = dataLength - 2;

        const lastItem = cachedChart.data[lastItemIx];
        const preLastItem = cachedChart.data[preLastItemIx];

        cachedChart.data[lastItemIx] = preLastItem;
        cachedChart.data[preLastItemIx] = lastItem;
      }

      console.log(`Update ${searchKey.id} (${cachedChart.data.length} entries)`);
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
