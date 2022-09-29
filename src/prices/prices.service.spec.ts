import { Currency, ONE_DAY_MS } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import { TEST_ADDR, TEST_CURRENT_TIMESTAMP, TEST_TOKEN } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { PricesService } from './prices.service';

describe('prices.service', () => {
  let service: PricesService;

  beforeEach(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<PricesService>(PricesService);
    setupMockChain();
  });

  afterEach(PlatformTest.reset);

  describe('getPriceSummary', () => {
    it('returns a price summary for the requested chains tokens', async () => {
      const results = await service.getPriceSummary([TEST_TOKEN, TEST_ADDR]);
      expect(results).toMatchSnapshot();
    });
  });

  describe('getPriceSnapshots', () => {
    describe('request with no tokens', () => {
      it('returns an empty map', async () => {
        const results = await service.getPriceSnapshots([], [TEST_CURRENT_TIMESTAMP]);
        expect(results).toMatchObject({});
      });
    });

    describe('request with no timestamps', () => {
      it('returns an empty map', async () => {
        const results = await service.getPriceSnapshots([TEST_TOKEN, TEST_ADDR], []);
        expect(results).toMatchObject({
          [TEST_TOKEN]: {},
          [TEST_ADDR]: {},
        });
      });
    });

    describe('proper full request with no currency', () => {
      it('returns an empty map', async () => {
        const results = await service.getPriceSnapshots(
          [TEST_TOKEN, TEST_ADDR],
          [TEST_CURRENT_TIMESTAMP, TEST_CURRENT_TIMESTAMP - ONE_DAY_MS],
        );
        expect(results).toMatchSnapshot();
      });
    });

    describe('proper full request with currency', () => {
      it('returns an empty map', async () => {
        const results = await service.getPriceSnapshots(
          [TEST_TOKEN, TEST_ADDR],
          [TEST_CURRENT_TIMESTAMP, TEST_CURRENT_TIMESTAMP - ONE_DAY_MS],
          Currency.AVAX,
        );
        expect(results).toMatchSnapshot();
      });
    });
  });
});
