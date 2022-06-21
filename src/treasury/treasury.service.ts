import { ChartTimeFrame } from '@badger-dao/sdk';
import { Service } from '@tsed/di';

import { HistoricTreasurySummarySnapshot } from '../aws/models/historic-treasury-summary-snapshot.model';
import { toChartDataKey } from '../charts/charts.utils';
import { queryTreasuryCharts, TREASURY_NAMESPACE } from './treasury.utils';

@Service()
export class TreasuryService {
  async loadTreasuryChartData(treasury: string, timeframe: ChartTimeFrame): Promise<HistoricTreasurySummarySnapshot[]> {
    const dataKey = toChartDataKey(TREASURY_NAMESPACE, treasury, timeframe);
    return queryTreasuryCharts(dataKey);
  }
}
