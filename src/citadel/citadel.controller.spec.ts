import { CitadelService } from './citadel.service';
import SuperTest from 'supertest';
import { PlatformTest } from '@tsed/common';
import { Server } from '../Server';

import citadelTreasuryMock from '@badger-dao/sdk-mocks/generated/ethereum/api/loadCitadelTreasury.json';

describe('CitadelController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /citadel/v1/treasury', () => {
    it('it returns the current citadel treasury summary', async (done: jest.DoneCallback) => {
      // TODO: remove to simply the mock once the sdk mocks are updated
      jest.spyOn(CitadelService.prototype, 'loadTreasurySummary').mockImplementation(async () => ({
        ...citadelTreasuryMock,
        fundingBps: 50,
        lockingBps: 40,
        stakingBps: 10,
      }));
      const { body } = await request.get('/citadel/v1/treasury').expect(200);
      expect(body).toMatchObject(citadelTreasuryMock);
      done();
    });
  });
});
