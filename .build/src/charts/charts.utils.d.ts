import { ChartTimeFrame } from "@badger-dao/sdk";
import { ChartDataBlob } from "../aws/models/chart-data-blob.model";
import { HistoricVaultSnapshotModel } from "../aws/models/historic-vault-snapshot.model";
import { ChartData } from "./chart-data.model";
export declare const CHART_GRANULARITY_TIMEFRAMES: ChartTimeFrame[];
/**
 *
 * @param id
 * @param timeframe
 * @param data
 * @returns
 */
export declare function toChartDataBlob<T extends ChartData<T>>(
  id: string,
  timeframe: ChartTimeFrame,
  data: T[]
): ChartDataBlob<T>;
/**
 *
 * @param namespace
 * @param id
 * @param timeframe
 * @returns
 */
export declare function toChartDataKey(namespace: string, id: string, timeframe: ChartTimeFrame): string;
/**
 *
 * @param reference
 * @param timestamp
 * @param timeframe
 * @returns
 */
export declare function shouldUpdate(reference: number, timestamp: number, timeframe: ChartTimeFrame): boolean;
/**
 *
 * @param reference
 * @param timestamp
 * @param timeframe
 * @returns
 */
export declare function shouldTrim(reference: number, timestamp: number, timeframe: ChartTimeFrame): boolean;
/**
 *
 * @param namespace
 * @param snapshot
 */
export declare function updateSnapshots<T extends ChartData<T>>(namespace: string, snapshot: T): Promise<void>;
export declare function queryVaultCharts(id: string): Promise<HistoricVaultSnapshotModel[]>;
