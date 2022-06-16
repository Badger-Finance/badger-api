import { ONE_DAY_MS } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import { TOKENS } from '../config/tokens.config';
import { randomSnapshots, setFullTokenDataMock, setupMapper, TEST_CHAIN } from '../test/tests.utils';
import { getVaultDefinition } from '../vaults/vaults.utils';
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
    const baseTime = 1646105170000;
    const today = new Date(baseTime);
    const yesterday = new Date(baseTime - ONE_DAY_MS);
    const oneWeek = new Date(baseTime - ONE_DAY_MS * 7);
    const oneMonth = new Date(baseTime - ONE_DAY_MS * 30);
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
        expect(actual).toBe(count);
      },
    );
  });

  describe('getChartData', () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);
    const oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() - 7);
    oneWeek.setUTCHours(0, 0, 0, 0);
    const oneMonth = new Date();
    oneMonth.setDate(oneMonth.getDate() - 30);
    oneMonth.setUTCHours(0, 0, 0, 0);
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
        setFullTokenDataMock();
        const expected = ChartsService.getRequestedDataPoints(new Date(start), new Date(end), granularity, size);
        const settDefinition = getVaultDefinition(TEST_CHAIN, TOKENS.BBADGER);
        // snapshot granularity @ 30 min intervals, 2 per hour, 48 per day
        const interval = granularity === ChartGranularity.HOUR ? 2 : 48 * size;
        const seed = randomSnapshots(settDefinition, count * interval);
        if (start !== end) {
          setupMapper(seed);
        } else {
          setupMapper([]);
        }
        const result = await service.getChartData(
          TEST_CHAIN,
          settDefinition,
          new Date(start),
          new Date(end),
          granularity,
          size,
        );
        expect(result.length).toBe(expected);
        for (const point of result) {
          expect(seed.includes(point)).toBeTruthy();
        }
      },
    );
  });
});
