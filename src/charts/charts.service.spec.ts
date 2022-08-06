import { ChartTimeFrame } from '@badger-dao/sdk';
import mockSnapshots from '@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultChart.json';
import { PlatformTest } from '@tsed/common';

import { setupMapper, TEST_ADDR, TEST_CHAIN } from '../test/tests.utils';
import { ChartsService } from './charts.service';

describe('charts.service', () => {
  let service: ChartsService;

  beforeAll(async () => {
    await PlatformTest.create();

    service = PlatformTest.get<ChartsService>(ChartsService);
  });

  afterEach(PlatformTest.reset);

  describe('loadVaultChartData', () => {
    it('returns data for a requested vault', async () => {
      setupMapper([{ data: mockSnapshots }]);
      const results = await service.loadVaultChartData(TEST_CHAIN, TEST_ADDR, ChartTimeFrame.Max);
      expect(results).toMatchObject(mockSnapshots);
    });
  });
});
