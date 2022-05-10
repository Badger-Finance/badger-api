import { getDataMapper } from '../aws/dynamodb.utils';
import { ChartDataBlob } from '../aws/models/chart-data-blob.model';
import { HistoricTreasurySummarySnapshot } from '../aws/models/historic-treasury-summary-snapshot.model';
import { TreasurySummarySnapshot } from '../aws/models/treasury-summary-snapshot.model';
import { TreasurySummary } from './interfaces/treasury-summary.interface';

export function defaultTreasury(address: string): TreasurySummary {
  return {
    address,
    value: 0,
    yield: 0,
    positions: [],
  };
}

export async function queryTreasurySummary(address: string): Promise<TreasurySummarySnapshot> {
  let treasury = defaultTreasury(address);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      TreasurySummarySnapshot,
      { address },
      { limit: 1, scanIndexForward: false },
    )) {
      treasury = item;
    }
    return treasury;
  } catch (err) {
    console.error(err);
    return treasury;
  }
}

export async function queryTreasuryCharts(id: string): Promise<HistoricTreasurySummarySnapshot[]> {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(ChartDataBlob, { id }, { limit: 1, scanIndexForward: false })) {
      return item.data as HistoricTreasurySummarySnapshot[];
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const TREASURY_NAMESPACE = 'treasury';
