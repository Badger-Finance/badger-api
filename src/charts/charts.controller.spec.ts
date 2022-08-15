import { ChartTimeFrame } from '@badger-dao/sdk';
import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { NetworkStatus } from '../errors/enums/network-status.enum';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { ChartsController } from './charts.controller';

describe('charts.controller', () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [ChartsController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(setupMockChain);

  describe('GET /charts/vault', () => {
    describe('with a missing vault address', () => {
      it('returns 400, QueryParamError', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/v3/charts/vault')
          .query({ address: '' });
        // TODO: inspect whats going on here with responses
        expect(statusCode).toEqual(NetworkStatus.NotFound);
        // expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('get vault data with different timeframes', () => {
      it('should return vault data for YTD', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/charts/vault')
          .query({ address: TEST_ADDR, timeframe: ChartTimeFrame.YTD });

        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });

      it('should return vault data for 1Y', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/charts/vault')
          .query({ address: TEST_ADDR, timeframe: ChartTimeFrame.Year });

        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
