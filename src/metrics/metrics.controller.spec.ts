import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { Server } from '../Server';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let metricsService: MetricsService;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    metricsService = PlatformTest.get<MetricsService>(MetricsService);
  });

  describe('GET /v2/metrics', () => {
    it('returns metric', async (done: jest.DoneCallback) => {
      jest.spyOn(metricsService, 'getProtocolMetrics').mockReturnValue(
        Promise.resolve({
          totalUsers: 30_000,
          totalValueLocked: 100_000_000_000,
          totalVaults: 30,
        }),
      );

      const { body } = await request.get('/v2/metrics').expect(200);
      expect(body).toMatchSnapshot();
      done();
    });
  });
});
