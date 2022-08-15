import { ChartTimeFrame } from '@badger-dao/sdk';
import { Service } from '@tsed/di';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { queryVaultCharts, toChartDataKey } from './charts.utils';

@Service()
export class ChartsService {
  async loadVaultChartData(
    address: string,
    timeframe: ChartTimeFrame,
    chain: Chain,
  ): Promise<HistoricVaultSnapshotModel[]> {
    // validate vault request is correct and valid
    const requestedVault = await chain.vaults.getVault(address);
    const vaultBlobId = getVaultEntityId(chain, requestedVault);
    const dataKey = toChartDataKey(HistoricVaultSnapshotModel.NAMESPACE, vaultBlobId, timeframe);
    return queryVaultCharts(dataKey);
  }
}
