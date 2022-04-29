import { Service } from '@tsed/di';
import { HistoricTreasurySummarySnapshot } from '../aws/models/historic-treasury-summary-snapshot.model';
import { toChartDataKey } from '../charts/charts.utils';
import { ChartTimeFrame } from '../charts/enums/chart-timeframe.enum';
import { TREASURY_NAMESPACE } from './treasury-indexer';
import { queryTreasuryCharts } from './treasury.utils';

@Service()
export class TreasuryService {
  async loadTreasuryChartData(treasury: string, timeframe: ChartTimeFrame): Promise<HistoricTreasurySummarySnapshot[]> {
    const dataKey = toChartDataKey(TREASURY_NAMESPACE, treasury, timeframe);
    return queryTreasuryCharts(dataKey);
  }
}
