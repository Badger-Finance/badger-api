import { PlatformTest } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import SuperTest from 'supertest';

import { Server } from '../Server';
import { TEST_ADDR } from '../test/constants';
import { setupMockAccounts } from '../test/tests.utils';
import * as accountsUtils from './accounts.utils';

describe('AccountsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    jest.resetAllMocks();
    setupMockAccounts();
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/accounts', () => {
    describe('with no specified account', () => {
      it('returns a not found response', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/accounts').expect(NotFound.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('with an invalid account input', () => {
      it('returns a bad request response', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/accounts/0xjintao').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('with a non participant account', () => {
      it('returns a default account response', async (done: jest.DoneCallback) => {
        jest.spyOn(accountsUtils, 'getCachedAccount').mockImplementation(async (_chain, address) => ({
          address,
          value: 0,
          earnedValue: 0,
          boost: 1,
          rank: 1035,
          boostRank: 1035,
          multipliers: {},
          data: {},
          claimableBalances: {},
          stakeRatio: 0,
          nftBalance: 0,
          bveCvxBalance: 0,
          diggBalance: 0,
          nativeBalance: 0,
          nonNativeBalance: 0,
        }));
        const { body } = await request.get('/v2/accounts/' + TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('with a participant account', () => {
      it('returns a cached account response', async (done: jest.DoneCallback) => {
        jest.spyOn(accountsUtils, 'getCachedAccount').mockImplementation(async (_chain, address) => ({
          address,
          value: 10,
          earnedValue: 1,
          boost: 2000,
          rank: 1,
          boostRank: 1,
          multipliers: {},
          data: {},
          claimableBalances: {},
          stakeRatio: 1,
          nftBalance: 3,
          bveCvxBalance: 0,
          diggBalance: 0,
          nativeBalance: 3,
          nonNativeBalance: 5,
        }));
        const { body } = await request.get('/v2/accounts/' + TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
