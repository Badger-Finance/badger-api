import { between } from '@aws/dynamodb-expressions';
import { getDataMapper } from '../aws/dynamodb.utils';
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

export async function getLatestTreasurySnapshot(address: string): Promise<HistoricTreasurySummarySnapshot> {
  let treasury = {
    ...defaultTreasury(address),
    timestamp: Date.now(),
  };
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      HistoricTreasurySummarySnapshot,
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

export async function queryTreasurySummarySnapshots(
  address: string,
  start: Date,
  end: Date,
): Promise<HistoricTreasurySummarySnapshot> {
  let treasury = {
    ...defaultTreasury(address),
    timestamp: Date.now(),
  };
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      HistoricTreasurySummarySnapshot,
      { address, timestamp: between(new Date(start).getTime(), new Date(end).getTime()) },
      { scanIndexForward: false },
    )) {
      treasury = item;
    }
    return treasury;
  } catch (err) {
    console.error(err);
    return treasury;
  }
}
