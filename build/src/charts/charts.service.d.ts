import { ChartTimeFrame } from '@badger-dao/sdk';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { Chain } from '../chains/config/chain.config';
export declare class ChartsService {
    loadVaultChartData(address: string, timeframe: ChartTimeFrame, chain: Chain): Promise<HistoricVaultSnapshotModel[]>;
}
