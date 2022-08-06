import { PlatformTest } from '@tsed/common';

import { ChartsService } from './charts.service';

describe('charts.service', () => {
  let service: ChartsService;

  beforeAll(async () => {
    await PlatformTest.create();

    service = PlatformTest.get<ChartsService>(ChartsService);
  });

  afterEach(PlatformTest.reset);

  describe('loadVaultChartData', () => {
    it('returns data for a requested vault', () => {
      console.log('woot!');
    });
  });
});
