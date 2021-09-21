import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Server } from '../Server';
import { GasService } from './gas.service';

describe('GasController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let gasService: GasService;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
    gasService = PlatformTest.get<GasService>(GasService);
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/gas', () => {
    it('returns a list of gas prices', async (done) => {
      jest
        .spyOn(gasService, 'getGasPrices')
        .mockImplementationOnce(() => Promise.resolve({ rapid: 100, fast: 99, standard: 95, slow: 90 }));

      request
        .get('/v2/gas')
        .expect(200)
        .end((err, response) => {
          expect(err).toBeNull();
          expect(response.body).toMatchSnapshot();
          done();
        });
    });
  });
});
