import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Server } from '../Server';
import { ProofsService } from './proofs.service';

describe('ProofsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let metricsService: ProofsService;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    metricsService = PlatformTest.get<ProofsService>(ProofsService);
  });

  describe('GET /v2/proofs', () => {
    it('returns metric', async (done: jest.DoneCallback) => {
      const { body } = await request.get('/v2/proofs').expect(200);
      expect(body).toMatchSnapshot();
      done();
    });
  });
});
