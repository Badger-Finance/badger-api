import { DataMapper } from '@aws/dynamodb-data-mapper';
import { ChartTimeFrame, ONE_DAY_MS, ONE_HOUR_MS } from '@badger-dao/sdk';

import { MOCK_VAULT_SNAPSHOTS, TEST_ADDR, TEST_CURRENT_TIMESTAMP, TEST_TOKEN } from '../test/constants';
import { mockQuery } from '../test/mocks.utils';
import { ChartData } from './chart-data.model';
import {
  queryVaultCharts,
  shouldTrim,
  shouldUpdate,
  toChartDataBlob,
  toChartDataKey,
  updateSnapshots,
} from './charts.utils';

describe('charts.utils', () => {
  describe('toChartDataBlob', () => {
    it('converts arbitrary data array into a chart data blob', () => {
      class AnimalData extends ChartData {
        animal!: string;
        noise!: string;

        toBlankData(): AnimalData {
          const copy = JSON.parse(JSON.stringify(this));
          copy.animal = '';
          copy.noise = '';
          return copy;
        }
      }

      const arbitraryData: AnimalData[] = [
        Object.assign(new AnimalData(), {
          id: 'sighting-0',
          timestamp: 10,
          animal: 'cow',
          noise: 'moo',
        }),
        Object.assign(new AnimalData(), {
          id: 'sighting-1',
          timestamp: 20,
          animal: 'dog',
          noise: 'bark',
        }),
        Object.assign(new AnimalData(), {
          id: 'sighting-2',
          timestamp: 30,
          animal: 'cat',
          noise: 'lmeow',
        }),
      ];
      const result = toChartDataBlob('animals', ChartTimeFrame.Week, arbitraryData);
      expect(result).toMatchSnapshot();
    });
  });

  describe('toChartDataKey', () => {
    it('creates data keys for chart data inputs', () =>
      expect(toChartDataKey('animal', 'noise', ChartTimeFrame.Day)).toEqual('animal_noise_24h'));
  });

  describe('shouldUpdate', () => {
    it.each([
      [1, 0, ChartTimeFrame.Day, false],
      [-1 + ONE_HOUR_MS * 6, 0, ChartTimeFrame.Week, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.YTD, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Month, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.ThreeMonth, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Year, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Max, false],
      [1 + ONE_HOUR_MS, 0, ChartTimeFrame.Day, true],
      [ONE_HOUR_MS * 6, 0, ChartTimeFrame.Week, true],
      [ONE_DAY_MS, 0, ChartTimeFrame.YTD, true],
      [ONE_DAY_MS, 0, ChartTimeFrame.Month, true],
      [ONE_DAY_MS, 0, ChartTimeFrame.ThreeMonth, true],
      [ONE_DAY_MS, 0, ChartTimeFrame.Year, true],
      [ONE_DAY_MS, 0, ChartTimeFrame.Max, true],
    ])('%d to %d on %s timeframe returns %s', (start, end, timeframe, result) => {
      expect(shouldUpdate(start, end, timeframe)).toEqual(result);
    });
  });

  describe('shouldTrim', () => {
    it.each([
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Day, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Week, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.YTD, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Month, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.ThreeMonth, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Year, false],
      [-1 + ONE_DAY_MS, 0, ChartTimeFrame.Max, false],
      [ONE_DAY_MS, 0, ChartTimeFrame.Day, true],
      [ONE_DAY_MS * 7, 0, ChartTimeFrame.Week, true],
      [ONE_DAY_MS * 180, 0, ChartTimeFrame.YTD, false],
      [ONE_DAY_MS * 30, 0, ChartTimeFrame.Month, true],
      [ONE_DAY_MS * 90, 0, ChartTimeFrame.ThreeMonth, true],
      [ONE_DAY_MS * 365, 0, ChartTimeFrame.Year, true],
      [ONE_DAY_MS * 730, 0, ChartTimeFrame.Max, false],
    ])('%d to %d on %s timeframe returns %s', (start, end, timeframe, result) => {
      expect(shouldTrim(start, end, timeframe)).toEqual(result);
    });
  });

  describe('updateSnapshots', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(console, 'debug').mockImplementation();
    });

    describe('add snapshot blob', () => {
      it('creates a new data blob and saves the new snapshot data', async () => {
        const snapshot = {
          id: TEST_ADDR,
          timestamp: TEST_CURRENT_TIMESTAMP,
        };
        const dataBlob = toChartDataBlob(TEST_ADDR, ChartTimeFrame.Week, [snapshot]);
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(DataMapper.prototype, 'get').mockImplementation(() => {
          throw new Error('Expected test error: get');
        });
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async () => dataBlob);
        await updateSnapshots('TEST_NAMESPACE', snapshot);
      });
    });

    describe('update snapshot blob', () => {
      it('creates a new data blob and saves the new snapshot data', async () => {
        const snapshot = {
          id: TEST_ADDR,
          timestamp: TEST_CURRENT_TIMESTAMP,
        };
        const dataBlob = toChartDataBlob(TEST_ADDR, ChartTimeFrame.Week, [snapshot]);
        jest.spyOn(DataMapper.prototype, 'get').mockImplementation();
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async () => dataBlob);
        await updateSnapshots('TEST_NAMESPACE', snapshot);
      });

      it('drops data blob and saves the new snapshot data', async () => {
        const snapshot = {
          id: TEST_ADDR,
          // january 1st
          timestamp: 1640995200000,
          data: [{ id: TEST_TOKEN }],
        };
        const dataBlob = toChartDataBlob(TEST_ADDR, ChartTimeFrame.Week, [snapshot]);
        jest.spyOn(DataMapper.prototype, 'get').mockImplementation();
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async () => dataBlob);
        await updateSnapshots('TEST_NAMESPACE', snapshot);
      });

      it('updates existing snapshot data', async () => {
        const snapshot = {
          id: TEST_ADDR,
          timestamp: TEST_CURRENT_TIMESTAMP,
        };
        const dataBlob = toChartDataBlob(TEST_ADDR, ChartTimeFrame.Week, [snapshot]);
        jest.spyOn(DataMapper.prototype, 'get').mockImplementation(async () => dataBlob);
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async () => dataBlob);
        await updateSnapshots('TEST_NAMESPACE', snapshot);
      });

      it('does not save data when encountering errors', async () => {
        const snapshot = {
          id: TEST_ADDR,
          timestamp: TEST_CURRENT_TIMESTAMP,
        };
        const dataBlob = toChartDataBlob(TEST_ADDR, ChartTimeFrame.Week, [snapshot]);
        jest.spyOn(DataMapper.prototype, 'get').mockImplementation(async () => dataBlob);
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async () => {
          throw new Error('Expected test error: put');
        });
        await updateSnapshots('TEST_NAMESPACE', snapshot);
      });
    });
  });

  describe('queryVaultCharts', () => {
    describe('system has saved data', () => {
      it('returns the requested chart data', async () => {
        mockQuery([{ data: MOCK_VAULT_SNAPSHOTS }]);
        const result = await queryVaultCharts(TEST_ADDR);
        expect(result).toMatchObject(MOCK_VAULT_SNAPSHOTS);
      });
    });

    describe('system has no data', () => {
      it('returns no data', async () => {
        mockQuery([]);
        const result = await queryVaultCharts(TEST_ADDR);
        expect(result).toMatchObject([]);
      });
    });

    describe('encounters an error', () => {
      it('returns no data', async () => {
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => {
          throw new Error('Expected test error: query');
        });
        const result = await queryVaultCharts(TEST_ADDR);
        expect(result).toMatchObject([]);
      });
    });
  });
});
