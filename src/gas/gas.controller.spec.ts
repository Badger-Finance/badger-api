import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { Server } from '../Server';
import { setupMockChain } from '../test/mocks.utils';

describe('GasController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /v2/gas', () => {
    it('returns a list of gas prices in eip-1559 format', async () => {
      setupMockChain();
      const { body } = await request.get('/v2/gas').expect(200);
      expect(body).toMatchSnapshot();
    });
  });
});
