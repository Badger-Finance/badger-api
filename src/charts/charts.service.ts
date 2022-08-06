import { ChartTimeFrame } from '@badger-dao/sdk';
import { Service } from '@tsed/di';

import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { queryVaultCharts } from '../vaults/vaults.utils';
import { toChartDataKey } from './charts.utils';

@Service()
export class ChartsService {
  async loadVaultChartData(
    vaultAddr: string,
    timeframe: ChartTimeFrame,
    chain: Chain,
  ): Promise<HistoricVaultSnapshotModel[]> {
    const vaultBlobId = HistoricVaultSnapshotModel.formBlobId(vaultAddr, chain.network);
    const dataKey = toChartDataKey(HistoricVaultSnapshotModel.NAMESPACE, vaultBlobId, timeframe);

    return queryVaultCharts(dataKey);
  }
}
