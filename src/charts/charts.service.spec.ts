import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { getSettDefinition } from '../setts/setts.utils';
import { randomSnapshots, setupMapper } from '../test/tests.utils';
import { ChartsService } from './charts.service';
import { ChartGranularity } from './enums/chart-granularity.enum';

describe('charts.service', () => {
  let service: ChartsService;

  beforeAll(async () => {
    await PlatformTest.create();

    service = PlatformTest.get<ChartsService>(ChartsService);
  });

  afterEach(PlatformTest.reset);

  describe('getRequestedDataPoints', () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() - 7);
    const oneMonth = new Date();
    oneMonth.setDate(oneMonth.getDate() - 30);
    it.each([
      [24, 1, ChartGranularity.HOUR, yesterday, today],
      [12, 2, ChartGranularity.HOUR, yesterday, today],
      [1, 24, ChartGranularity.HOUR, yesterday, today],
      [1, 1, ChartGranularity.DAY, yesterday, today],
      [7, 1, ChartGranularity.DAY, oneWeek, today],
      [7 * 24, 1, ChartGranularity.HOUR, oneWeek, today],
      [7 * 12, 2, ChartGranularity.HOUR, oneWeek, today],
      [30, 1, ChartGranularity.DAY, oneMonth, today],
      [60, 12, ChartGranularity.HOUR, oneMonth, today],
      [0, 12, ChartGranularity.HOUR, today, today],
      [0, 1, ChartGranularity.HOUR, today, today],
      [0, 1, ChartGranularity.DAY, today, today],
      [0, 12, ChartGranularity.DAY, today, today],
    ])(
      'returns %d data points for granularity %d %s from %s to %s',
      (count: number, size: number, granularity: ChartGranularity, start: Date, end: Date) => {
        const actual = ChartsService.getRequestedDataPoints(new Date(start), new Date(end), granularity, size);
        expect(actual).toEqual(count);
      },
    );
  });

  describe('getChartData', () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() - 7);
    const oneMonth = new Date();
    oneMonth.setDate(oneMonth.getDate() - 30);
    it.each([
      [24, 1, ChartGranularity.HOUR, yesterday, today],
      [12, 2, ChartGranularity.HOUR, yesterday, today],
      [1, 24, ChartGranularity.HOUR, yesterday, today],
      [1, 1, ChartGranularity.DAY, yesterday, today],
      [7, 1, ChartGranularity.DAY, oneWeek, today],
      [7 * 24, 1, ChartGranularity.HOUR, oneWeek, today],
      [7 * 12, 2, ChartGranularity.HOUR, oneWeek, today],
      [30, 1, ChartGranularity.DAY, oneMonth, today],
      [60, 12, ChartGranularity.HOUR, oneMonth, today],
      [0, 12, ChartGranularity.HOUR, today, today],
      [0, 1, ChartGranularity.HOUR, today, today],
      [0, 1, ChartGranularity.DAY, today, today],
      [0, 12, ChartGranularity.DAY, today, today],
    ])(
      'returns %d data points for granularity %d %s from %s to %s',
      async (count: number, size: number, granularity: ChartGranularity, start: Date, end: Date) => {
        const expected = ChartsService.getRequestedDataPoints(new Date(start), new Date(end), granularity, size);
        const settDefinition = getSettDefinition(new Ethereum(), TOKENS.BBADGER);
        // snapshot granularity @ 30 min intervals, 2 per hour, 48 per day
        const interval = granularity === ChartGranularity.HOUR ? 2 : 48 * size;
        const seed = randomSnapshots(settDefinition, count * interval);
        if (start != end) {
          setupMapper(seed);
        } else {
          setupMapper([]);
        }
        const result = await service.getChartData(settDefinition, new Date(start), new Date(end), granularity, size);
        expect(result.length).toEqual(expected);
        for (const point of result) {
          expect(seed.includes(point)).toBeTruthy();
        }
      },
    );
  });
});
