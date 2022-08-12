// import { ChartTimeFrame } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { NetworkStatus } from '../errors/enums/network-status.enum';
import { Server } from '../Server';
// import { TEST_ADDR } from '../test/constants';
// import { setupMockChain } from '../test/mocks.utils';
// import { setupVaultsHistoricDDB } from '../test/tests.utils';

describe('ChartsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /v3/charts/vault', () => {
    describe('with a missing vault address', () => {
      it('returns 400, QueryParamError', async () => {
        const { body } = await request.get('/v3/charts/vault').expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });
    });

    // describe('get vault data with different timeframes', () => {
    //   it('should return vault data for YTD', async () => {
    //     setupVaultsHistoricDDB();

    //     const { body } = await request
    //       .get(`/v3/charts/vault?address=${TEST_ADDR}&timeframe=${ChartTimeFrame.YTD}`)
    //       .expect(NetworkStatus.Success);

    //     expect(body).toMatchSnapshot();
    //   });

    //   it('should return vault data for 1Y', async () => {
    //     setupVaultsHistoricDDB();

    //     const { body } = await request
    //       .get(`/v3/charts/vault?address=${TEST_ADDR}&timeframe=${ChartTimeFrame.Year}`)
    //       .expect(NetworkStatus.Success);

    //     expect(body).toMatchSnapshot();
    //   });
    // });
  });
});
