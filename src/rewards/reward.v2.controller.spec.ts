import { RewardsService } from '@badger-dao/sdk';
import rewardsLoadSchedulesMock from '@badger-dao/sdk-mocks/generated/ethereum/rewards/loadSchedules.json';
import { PlatformTest } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import SuperTest from 'supertest';

import { ChainVaults } from '../chains/vaults/chain.vaults';
import { Server } from '../Server';
import { TEST_ADDR, TEST_TOKEN } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';

const baseSchedules = rewardsLoadSchedulesMock.slice(0, 3);

const schedulesMockMap = {
  [TEST_TOKEN]: baseSchedules,
  [TEST_ADDR]: baseSchedules.map((rw) => ({
    ...rw,
    beneficiary: TEST_ADDR,
  })),
};

const activeSchedulesMockMap = {
  [TEST_TOKEN]: schedulesMockMap[TEST_TOKEN].map((rw) => ({
    ...rw,
    compPercent: 50,
  })),
  [TEST_ADDR]: schedulesMockMap[TEST_ADDR].map((rw) => ({
    ...rw,
    compPercent: 70,
  })),
};

export function setupRewardsMocks() {
  jest.spyOn(RewardsService.prototype, 'loadSchedules').mockImplementation(async (_b) => {
    return schedulesMockMap[TEST_TOKEN];
  });
  jest.spyOn(RewardsService.prototype, 'loadActiveSchedules').mockImplementation(async (_b) => {
    return activeSchedulesMockMap[TEST_TOKEN];
  });
  setupMockChain();
}

describe('reward.v2.controller', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /v2/reward/schedules', () => {
    describe('with no specified chain', () => {
      it('returns schedules for default chain and all vaults', async () => {
        setupRewardsMocks();
        const { body } = await request.get('/v2/reward/schedules').expect(200);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with active param true', () => {
      it('returns active schedules for default chain and all vaults', async () => {
        setupRewardsMocks();
        const { body } = await request.get('/v2/reward/schedules?active=true').expect(200);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async () => {
        setupRewardsMocks();
        const { body } = await request.get('/v2/reward/schedules?chain=invalid').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
      });
    });
  });

  describe('GET /v2/reward/schedules/<beneficiary>', () => {
    describe('with no specified chain', () => {
      it('returns schedule for default chain and one vault', async () => {
        setupRewardsMocks();
        const { body } = await request.get(`/v2/reward/schedules/${TEST_ADDR}`).expect(200);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with active param true', () => {
      it('returns schedules for default chain and one vault', async () => {
        setupRewardsMocks();
        const { body } = await request.get(`/v2/reward/schedules/${TEST_ADDR}?active=true`).expect(200);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async () => {
        setupRewardsMocks();
        const { body } = await request.get(`/v2/reward/schedules/${TEST_ADDR}?chain=invalid`).expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with invalid param specified', () => {
      it('returns a 400, NotFound', async () => {
        setupRewardsMocks();
        jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => {
          throw new Error('Missing Vault');
        });
        const { body } = await request.get(`/v2/reward/schedules/unknowsvaultdata`).expect(NotFound.STATUS);
        expect(body).toMatchSnapshot();
      });
    });
  });
});
