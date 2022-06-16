import BadgerSDK, { RewardsService } from '@badger-dao/sdk';
import rewardsLoadSchedulesMock from '@badger-dao/sdk-mocks/generated/ethereum/rewards/loadSchedules.json';
import { PlatformTest } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import SuperTest from 'supertest';

import { TOKENS } from '../config/tokens.config';
import { NetworkStatus } from '../errors/enums/newtroks.status.enum';
import { Server } from '../Server';

describe('RewardController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  const schedulesMockMap = {
    [TOKENS.BBADGER]: rewardsLoadSchedulesMock,
    [TOKENS.BCVX]: rewardsLoadSchedulesMock.map((rw) => ({
      ...rw,
      beneficiary: TOKENS.BCVX,
    })),
  };

  const activeSchedulesMockMap = {
    [TOKENS.BBADGER]: schedulesMockMap[TOKENS.BBADGER].map((rw) => ({
      ...rw,
      compPercent: 50,
    })),
    [TOKENS.BCVX]: schedulesMockMap[TOKENS.BCVX].map((rw) => ({
      ...rw,
      compPercent: 70,
    })),
  };

  function setupDefaultMocks() {
    jest.spyOn(RewardsService.prototype, 'loadSchedules').mockImplementation(async (beneficiary) => {
      return schedulesMockMap[beneficiary];
    });
    jest.spyOn(RewardsService.prototype, 'loadActiveSchedules').mockImplementation(async (beneficiary) => {
      return activeSchedulesMockMap[beneficiary];
    });
    jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();
  }

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /v3/reward/schedules', () => {
    describe('with no specified chain', () => {
      it('returns schedules for default chain and all vaults', async (done: jest.DoneCallback) => {
        setupDefaultMocks();
        const { body } = await request.get('/v3/reward/schedules/list').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with active param true', () => {
      it('returns active schedules for default chain and all vaults', async (done: jest.DoneCallback) => {
        setupDefaultMocks();
        const { body } = await request.get('/v3/reward/schedules/list?active=true').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async (done: jest.DoneCallback) => {
        setupDefaultMocks();
        const { body } = await request.get('/v3/reward/schedules/list?chain=invalid').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });

  describe('GET /v3/reward/schedules', () => {
    describe('with no specified chain', () => {
      it('returns schedule for default chain and one vault', async (done: jest.DoneCallback) => {
        setupDefaultMocks();
        const { body } = await request
          .get(`/v3/reward/schedules?address=${TOKENS.BBADGER}`)
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with active param true', () => {
      it('returns schedules for default chain and one vault', async (done: jest.DoneCallback) => {
        setupDefaultMocks();
        const { body } = await request
          .get(`/v3/reward/schedules?address=${TOKENS.BBADGER}&active=true`)
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async (done: jest.DoneCallback) => {
        setupDefaultMocks();
        const { body } = await request
          .get(`/v3/reward/schedules?address=${TOKENS.BBADGER}&chain=invalid`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with invalid param specified', () => {
      it('returns a 404, NotFound', async (done: jest.DoneCallback) => {
        setupDefaultMocks();
        const { body } = await request
          .get(`/v3/reward/schedules?address=unknowsvaultdata`)
          .expect(NetworkStatus.NotFound);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
