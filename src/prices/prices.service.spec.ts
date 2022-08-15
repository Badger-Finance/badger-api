import { PlatformTest } from '@tsed/common';

import { TEST_ADDR, TEST_TOKEN } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
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
      setupMockChain();
      const results = await service.getPriceSummary([TEST_TOKEN, TEST_ADDR]);
      expect(results).toMatchSnapshot();
    });
  });
});
