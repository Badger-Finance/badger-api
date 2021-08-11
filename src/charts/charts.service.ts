import { Service } from '@tsed/di';
import { Chain } from '../chains/config/chain.config';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { getSettSnapshotsInRange } from '../setts/setts.utils';
import { ChartGranularity } from './enums/chart-granularity.enum';

@Service()
export class ChartsService {
  async getChartData(
    chain: Chain,
    sett: SettDefinition,
    start: Date,
    end: Date,
    granularity: ChartGranularity,
    period: number,
  ): Promise<SettSnapshot[]> {
    let snapshots = await getSettSnapshotsInRange(sett, start, end);

    // snapshot granularity @ 30 min intervals, 2 per hour, 48 per day
    const interval = granularity === ChartGranularity.HOUR ? 2 : 48 * period;
    // filter data down to selected granularity period combination
    snapshots = snapshots.filter((_s, i) => i % interval === 0);

    const expectedDataPoints = this.getRequestedDataPoints(start, end, granularity, period);
    if (snapshots.length < expectedDataPoints) {
      let lastSnapshot = snapshots[snapshots.length - 1];
      if (!lastSnapshot) {
        lastSnapshot = {
          address: sett.settToken,
          value: 0,
          balance: 0,
          supply: 0,
          ratio: 1,
          height: await chain.provider.getBlockNumber(),
          timestamp: Date.now(),
        };
      }
      const thirtyMinutesBlocks = parseInt((chain.blocksPerYear / 365 / 24 / 2).toString());
      while (snapshots.length < expectedDataPoints) {
        const newSnapshot: SettSnapshot = {
          address: sett.settToken,
          value: 0,
          balance: 0,
          supply: 0,
          ratio: 1,
          height: lastSnapshot.height - thirtyMinutesBlocks * (interval ?? 1),
          timestamp: lastSnapshot.timestamp - 30 * 60 * 1000 * (interval ?? 1),
        };
        snapshots.push(newSnapshot);
        lastSnapshot = newSnapshot;
      }
    }

    return snapshots;
  }

  getRequestedDataPoints(start: Date, end: Date, granularity: ChartGranularity, period: number): number {
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
