import { Currency } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { TEST_CHAIN } from '../test/tests.utils';
import { PricesService } from './prices.service';
import * as pricesUtils from './prices.utils';

describe('leaderboards.service', () => {
  let service: PricesService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<PricesService>(PricesService);
  });

  afterEach(PlatformTest.reset);

  describe('getPriceSummary', () => {
    it('returns a price summary for the requested chains tokens', async () => {
      jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token: string) => ({
        address: token,
        price: parseInt(token.slice(0, 5), 16),
        updatedAt: Date.now(),
      }));
      jest.spyOn(pricesUtils, 'convert').mockImplementation(async (price: number, currency?: Currency) => {
        if (currency === Currency.USD) {
          return price;
        }
        return (price * 8) / 3;
      });
      const results = await service.getPriceSummary(TEST_CHAIN);
      expect(results).toMatchSnapshot();
    });
  });
});
