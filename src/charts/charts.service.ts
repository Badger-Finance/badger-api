import { Service } from '@tsed/di';

import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { getVaultSnapshotsInRange } from '../vaults/vaults.utils';
import { ChartGranularity } from './enums/chart-granularity.enum';

@Service()
export class ChartsService {
  async getChartData(
    chain: Chain,
    sett: VaultDefinition,
    start: Date,
    end: Date,
    granularity: ChartGranularity,
    period: number,
  ): Promise<HistoricVaultSnapshotModel[]> {
    let snapshots = await getVaultSnapshotsInRange(chain, sett, start, end);

    // snapshot granularity @ 30 min intervals, 2 per hour, 48 per day
    const interval = granularity === ChartGranularity.HOUR ? 2 : 48 * period;
    // filter data down to selected granularity period combination
    snapshots = snapshots.filter((_s, i) => i % interval === 0);

    return snapshots;
  }

  static getRequestedDataPoints(start: Date, end: Date, granularity: ChartGranularity, period: number): number {
    let returnedDataPoints: number;
    const diffInMs = new Date(end).getTime() - new Date(start).getTime();
    if (granularity === ChartGranularity.DAY) {
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      returnedDataPoints = Math.floor(diffInDays / period);
    } else {
      const diffInHours = diffInMs / (1000 * 60 * 60);
      returnedDataPoints = Math.floor(diffInHours / period);
    }
    return returnedDataPoints;
  }
}
