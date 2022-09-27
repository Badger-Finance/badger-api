import { ChartTimeFrame, ONE_DAY_MS, ONE_HOUR_MS } from '@badger-dao/sdk';

import { ChartData } from './chart-data.model';
import { shouldTrim, shouldUpdate, toChartDataBlob, toChartDataKey } from './charts.utils';

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
});
