import { BadRequest } from '@tsed/exceptions';
import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { Chain } from '../chains/config/chain.config';
import { TEST_ADDR, TEST_TOKEN } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { PricesController } from './prices.controller';
import * as pricesUtils from './prices.utils';
import { getPrice } from './prices.utils';

describe('PricesController', () => {
  let chain: Chain;

  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [PricesController],
    }),
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => {
    chain = setupMockChain();
  });

  describe('GET /prices', () => {
    describe('with a valid specified chain', () => {
      it('returns token config', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get('/prices');
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with a valid specified chain and specific tokens', () => {
      it('returns token config', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/prices')
          .query({ tokens: [TEST_ADDR, TEST_TOKEN].join(',') });
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request.get('/prices').query({ chain: 'invalid' });
        expect(statusCode).toEqual(400);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /prices/snapshots', () => {
    describe('request two tokens across two timestamps', () => {
      it('returns snapshots of requested tokens at given times', async () => {
        jest.spyOn(pricesUtils, 'queryPriceAtTimestamp').mockImplementation(async (token, timestamp, _c) => {
          const basePrice = await getPrice(chain, token);
          return {
            ...basePrice,
            price: timestamp / basePrice.price,
            updatedAt: timestamp,
          };
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/prices/snapshots')
          .query({ tokens: [TEST_ADDR, TEST_TOKEN].join(','), timestamps: '1660549796,1650549796' });
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
