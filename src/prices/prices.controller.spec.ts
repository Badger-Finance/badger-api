import { PlatformTest } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import SuperTest from 'supertest';
import { Server } from '../Server';
import { bscTokensConfig } from '../tokens/config/bsc-tokens.config';
import { ethTokensConfig } from '../tokens/config/eth-tokens.config';
import { PricesService } from './prices.service';

describe('PricesController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let pricesService: PricesService;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    pricesService = PlatformTest.get<PricesService>(PricesService);
  });

  afterEach(PlatformTest.reset);

  const getPrice = (address: string): number => parseInt(address.slice(0, 3), 16);

  describe('GET /v2/prices', () => {
    describe('with no specified chain', () => {
      it('returns eth token config', async (done: jest.DoneCallback) => {
        const result = Object.fromEntries(Object.keys(ethTokensConfig).map((token) => [token, getPrice(token)]));
        jest.spyOn(pricesService, 'getPriceSummary').mockImplementationOnce(() => Promise.resolve(result));
        const { body } = await request.get('/v2/prices').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with a specified chain', () => {
      it('returns the specified token config for eth', async (done: jest.DoneCallback) => {
        const result = Object.fromEntries(Object.keys(ethTokensConfig).map((token) => [token, getPrice(token)]));
        jest.spyOn(pricesService, 'getPriceSummary').mockImplementationOnce(() => Promise.resolve(result));
        const { body } = await request.get('/v2/prices?chain=eth').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns the specified token config for bsc', async (done: jest.DoneCallback) => {
        const result = Object.fromEntries(Object.keys(bscTokensConfig).map((token) => [token, getPrice(token)]));
        jest.spyOn(pricesService, 'getPriceSummary').mockImplementationOnce(() => Promise.resolve(result));
        const { body } = await request.get('/v2/prices?chain=bsc').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/prices?chain=invalid').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
