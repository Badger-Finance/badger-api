import { PlatformTest } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import SuperTest from 'supertest';
import * as accountIndexer from '../indexers/accounts-indexer';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { Server } from '../Server';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import * as accountsUtils from './accounts.utils';

describe('AccountsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    jest.resetAllMocks();
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
        jest.spyOn(accountIndexer, 'refreshUserAccounts').mockImplementation(() => Promise.resolve());
        setupMapper([]);
        const { body } = await request.get('/v2/accounts/' + TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('with a participant account', () => {
      it('returns a cached account response', async (done: jest.DoneCallback) => {
        jest.spyOn(accountIndexer, 'refreshUserAccounts').mockImplementation(() => Promise.resolve());
        const defaultAccount = {
          address: TEST_ADDR,
          boost: 0,
          boostRank: 1,
          multipliers: [],
          value: 0,
          earnedValue: 0,
          balances: [],
          claimableBalances: [],
          nativeBalance: 0,
          nonNativeBalance: 0,
        };
        jest.spyOn(accountsUtils, 'getCachedBoost').mockImplementation(async () => ({
          leaderboard: LeaderBoardType.BadgerBoost,
          address: TEST_ADDR,
          rank: 3,
          boost: 2000,
          stakeRatio: 1,
          nftMultiplier: 1,
          nativeBalance: 2033222,
          nonNativeBalance: 23129,
        }));
        setupMapper([defaultAccount]);
        const { body } = await request.get('/v2/accounts/' + TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
