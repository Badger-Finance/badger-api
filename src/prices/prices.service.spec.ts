import { PlatformTest } from '@tsed/common';

import { mockPricing, TEST_CHAIN } from '../test/tests.utils';
import { PricesService } from './prices.service';

describe('leaderboards.service', () => {
  let service: PricesService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<PricesService>(PricesService);
  });

  afterEach(PlatformTest.reset);

  describe('getPriceSummary', () => {
    it('returns a price summary for the requested chains tokens', async () => {
      mockPricing();
      const results = await service.getPriceSummary(Object.keys(TEST_CHAIN.tokens));
      expect(results).toMatchSnapshot();
    });
  });
});
