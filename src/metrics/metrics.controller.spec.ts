import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { NetworkStatus } from '../errors/enums/network-status.enum';
import { MOCK_PROTOCOL_METRICS } from '../test/constants';
import { MetricsController } from './metrics.controller';
import * as metricsUtils from './metrics.utils';

describe('MetricsController', () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [MetricsController],
    }),
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe('GET /v2/metrics', () => {
    it('returns metric', async () => {
      jest.spyOn(metricsUtils, 'queryProtocolMetrics').mockImplementation(async () => MOCK_PROTOCOL_METRICS);
      const { body, statusCode } = await PlatformServerlessTest.request.get('/metrics');
      expect(statusCode).toEqual(NetworkStatus.Success);
      expect(JSON.parse(body)).toMatchSnapshot();
    });
  });
});
