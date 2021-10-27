import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Server } from '../Server';
import { GasService } from './gas.service';

describe('GasController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let gasService: GasService;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
    gasService = PlatformTest.get<GasService>(GasService);
  });
  beforeEach(jest.resetAllMocks);
  afterAll(PlatformTest.reset);

  describe('GET /v2/gas', () => {
    it('returns a list of gas prices in eip-1559 format', async (done: jest.DoneCallback) => {
      jest.spyOn(gasService, 'getGasPrices').mockImplementation(() =>
        Promise.resolve({
          rapid: {
            maxFeePerGas: 130,
            maxPriorityFeePerGas: 2,
          },
          fast: {
            maxFeePerGas: 115,
            maxPriorityFeePerGas: 2,
          },
          standard: {
            maxFeePerGas: 100,
            maxPriorityFeePerGas: 2,
          },
          slow: {
            maxFeePerGas: 85,
            maxPriorityFeePerGas: 2,
          },
        }),
      );
      const { body } = await request.get('/v2/gas').expect(200);
      expect(body).toMatchSnapshot();
      done();
    });
  });

  it('returns a list of gas prices in legacy format', async (done: jest.DoneCallback) => {
    jest
      .spyOn(gasService, 'getGasPrices')
      .mockImplementation(() => Promise.resolve({ rapid: 130, fast: 115, standard: 100, slow: 85 }));
    const { body } = await request.get('/v2/gas').expect(200);
    expect(body).toMatchSnapshot();
    done();
  });
});
