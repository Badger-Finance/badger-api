import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { Server } from '../Server';
import { setupChainGasPrices } from '../test/tests.utils';

describe('GasController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeEach(() => {
    jest.resetAllMocks();
    setupChainGasPrices();
  });
  afterAll(PlatformTest.reset);

  describe('GET /v2/gas', () => {
    it('returns a list of gas prices in eip-1559 format', async (done: jest.DoneCallback) => {
      const { body } = await request.get('/v2/gas').expect(200);
      expect(body).toMatchSnapshot();
      done();
    });
  });

  it('returns a list of gas prices in legacy format', async (done: jest.DoneCallback) => {
    const { body } = await request.get('/v2/gas?chain=polygon').expect(200);
    expect(body).toMatchSnapshot();
    done();
  });
});
