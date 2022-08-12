import { ChartTimeFrame } from '@badger-dao/sdk';
import { ChartData } from '../../charts/chart-data.model';
export declare class ChartDataBlob<T extends ChartData<T>> {
    id: string;
    timeframe: ChartTimeFrame;
    data: Array<T>;
}
