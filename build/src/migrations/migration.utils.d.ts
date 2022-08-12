import { ChartTimeFrame } from '@badger-dao/sdk';
import { MigrationProcessData } from '../aws/models/migration-process.model';
import { ChartData } from '../charts/chart-data.model';
export declare function getMigrationData(id: string): Promise<MigrationProcessData | null>;
export declare function checkTimeframeCondition(timestamp: number, timeframe: ChartTimeFrame): boolean;
export declare function pushHistoricSnapshots<T extends ChartData<T>>(namespace: string, snapshot: T): Promise<number>;
