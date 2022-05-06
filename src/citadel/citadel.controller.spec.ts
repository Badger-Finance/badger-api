import { BadRequest } from '@tsed/exceptions';

import { CitadelService } from './citadel.service';
import SuperTest from 'supertest';
import { PlatformTest } from '@tsed/common';
import { Server } from '../Server';

import citadelTreasuryMock from '@badger-dao/sdk-mocks/generated/ethereum/api/loadCitadelTreasury.json';
import { TOKENS } from '../config/tokens.config';
import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { citadelRewardEventsMock } from './mocks/citadel-reward-events.mock';
import { CitadelTreasurySummary } from '@badger-dao/sdk';

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
      const expected: CitadelTreasurySummary = {
        ...citadelTreasuryMock,
        staked: 0,
        stakedPercent: 0,
        supply: 10,
        marketCap: 100,
      };
      jest.spyOn(CitadelService.prototype, 'loadTreasurySummary').mockImplementation(async () => expected);
      const { body } = await request.get('/citadel/v1/treasury').expect(200);
      expect(body).toMatchObject(expected);
      done();
    });
  });

  describe('GET /citadel/v1/rewards', () => {
    const TEST_TOKEN = TOKENS.CTDL;
    const TEST_USER = '0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28';

    it('should return rewards for user', async (done: jest.DoneCallback) => {
      // TODO: Replace with Citadel service mocks from sdk, once rewards are available
      jest.spyOn(CitadelService.prototype, 'getListRewards').mockImplementation(async () => citadelRewardEventsMock);

      const { body } = await request
        .get(`/citadel/v1/rewards?filter=${RewardFilter.PAID}&token=${TEST_TOKEN}&user=${TEST_USER}`)
        .expect(200);
      expect(body).toMatchSnapshot();
      done();
    });

    it('should fail without token addr param', async (done: jest.DoneCallback) => {
      const { body } = await request.get('/citadel/v1/rewards').expect(BadRequest.STATUS);
      expect(body).toMatchSnapshot();
      done();
    });

    it('should fail without user addr param for paid filter', async (done: jest.DoneCallback) => {
      const { body } = await request
        .get(`/citadel/v1/rewards?filter=${RewardFilter.PAID}&token=${TEST_TOKEN}`)
        .expect(BadRequest.STATUS);
      expect(body).toMatchSnapshot();
      done();
    });
  });
});
