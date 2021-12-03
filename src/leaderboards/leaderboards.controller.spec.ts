import { PlatformTest } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import SuperTest from 'supertest';
import * as accountIndexer from '../indexers/accounts-indexer';
import { Server } from '../Server';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';

describe('AccountsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
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
        jest.spyOn(accountIndexer, 'refreshAccounts').mockImplementation(() => Promise.resolve());
        setupMapper([]);
        const { body } = await request.get('/v2/accounts/' + TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('with a participant account', () => {
      it('returns a cached account response', async (done: jest.DoneCallback) => {
        jest.spyOn(accountIndexer, 'refreshAccounts').mockImplementation(() => Promise.resolve());
        const defaultAccount = {
          address: TEST_ADDR,
          boost: 2000,
          boostRank: 3,
          multipliers: [],
          value: 320232,
          earnedValue: 2312,
          balances: [],
          claimableBalances: [],
          nativeBalance: 2033222,
          nonNativeBalance: 23129,
        };
        setupMapper([defaultAccount]);
        const { body } = await request.get('/v2/accounts/' + TEST_ADDR).expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
