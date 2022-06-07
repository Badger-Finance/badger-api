import { ChartTimeFrame } from '@badger-dao/sdk';
import { ChartData } from './chart-data.model';
import { toChartDataBlob } from './charts.utils';

describe('charts.utils', () => {
  describe('toChartDataBlob', () => {
    it('converts arbitrary data array into a chart data blob', () => {
      class AnimalData extends ChartData<AnimalData> {
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

  describe('', () => {});
});
