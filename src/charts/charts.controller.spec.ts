import { ChartTimeFrame } from '@badger-dao/sdk/lib/api/enums/chart-timeframe.enum';
import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { NetworkStatus } from '../errors/enums/newtroks.status.enum';
import { Server } from '../Server';
import { mockChainVaults, setupVaultsHistoricDDB } from '../test/tests.utils';

describe('ChartsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    mockChainVaults();
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/charts/vault', () => {
    describe('with a missing vault address', () => {
      it('returns 400, QueryParamError', async () => {
        const { body } = await request.get('/v2/charts/vault').expect(NetworkStatus.BadRequest);

        expect(body).toMatchSnapshot();
      });
    });

    describe('get vault data with different timeframes', () => {
      const TEST_VAULT = '0xBE08Ef12e4a553666291E9fFC24fCCFd354F2Dd2';

      it('should return vault data for YTD', async () => {
        setupVaultsHistoricDDB();

        const { body } = await request
          .get(`/v2/charts/vault?address=${TEST_VAULT}&timeframe=${ChartTimeFrame.YTD}`)
          .expect(NetworkStatus.Success);

        expect(body).toMatchSnapshot();
      });

      it('should return vault data for 1Y', async () => {
        setupVaultsHistoricDDB();

        const { body } = await request
          .get(`/v2/charts/vault?address=${TEST_VAULT}&timeframe=${ChartTimeFrame.Year}`)
          .expect(NetworkStatus.Success);

        expect(body).toMatchSnapshot();
      });
    });
  });
});
