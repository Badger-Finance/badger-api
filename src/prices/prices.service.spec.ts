import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { PricesService } from './prices.service';
import { PriceData } from '../tokens/interfaces/price-data.interface';
import * as pricesUtils from './prices.utils';

describe('leaderboards.service', () => {
  const chain = new Ethereum();
  let service: PricesService;
  let priceData: PriceData;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<PricesService>(PricesService);
  });

  afterEach(PlatformTest.reset);

  describe('getPriceSummary', () => {
    it('returns a price summary for the requested chains tokens', async () => {
      jest.spyOn(pricesUtils, 'getPriceData').mockImplementation(async (tokens) => {
        priceData = Object.fromEntries(
          Object.keys(tokens).map((token) => [
            token,
            {
              name: 'Test',
              address: token,
              usd: parseInt(token.slice(0, 5), 16),
              eth: parseInt(token.slice(0, 5), 16) / 4000,
            },
          ]),
        );
        return priceData;
      });
      const results = await service.getPriceSummary(chain);
      expect(results).toMatchSnapshot();
    });
  });
});
