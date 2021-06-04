import { PlatformTest } from '@tsed/common';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import SuperTest from 'supertest';
import { Server } from '../Server';

describe('ChartsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/charts', () => {
    describe('with invalid args', () => {
      describe('with a missing id', () => {
        it('returns a 422', async (done) => {
          const { body } = await request.get('/v2/charts').expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with an invalid chain', () => {
        it('returns a 422', async (done) => {
          const { body } = await request
            .get('/v2/charts?id=0x4206942069420694206942069420694206942069&chain=safemoonchain')
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });
    });

    describe('with an invalid address', () => {
      it('returns a 404', async (done) => {
        const { body } = await request
          .get('/v2/charts?id=0x4206942069420694206942069420694206942069')
          .expect(NotFound.STATUS);

        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
