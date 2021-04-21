import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Server } from '../Server';
import { HarvestsService } from './harvests.service';

describe('HarvestsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let harvestsService: HarvestsService;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
    harvestsService = PlatformTest.get<HarvestsService>(HarvestsService);
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/harvests', () => {
    it('returns a list of harvests', async (done) => {
      jest.spyOn(harvestsService, 'listHarvests').mockImplementationOnce(() => Promise.resolve({ harvests: [] }));

      request
        .get('/v2/harvests')
        .expect(200)
        .end((err, response) => {
          expect(err).toBeUndefined();
          expect(response).toMatchObject({
            body: expect.any(Array),
          });
          done();
        });
    });
  });
});
