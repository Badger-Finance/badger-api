import { PlatformTest } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';
import SuperTest from 'supertest';
import { Server } from '../Server';

describe('TokensController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/tokens', () => {
    describe('with no specified chain', () => {
      it('returns eth token config', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/tokens').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with a specified chain', () => {
      it('returns the specified token config for eth', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/tokens?chain=eth').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns the specified token config for bsc', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/tokens?chain=bsc').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/tokens?chain=invalid').expect(BadRequest.STATUS);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
