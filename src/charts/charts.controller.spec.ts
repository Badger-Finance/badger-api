import { ChartTimeFrame } from '@badger-dao/sdk/lib/api/enums/chart-timeframe.enum';
import { PlatformTest } from '@tsed/common';
import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import SuperTest from 'supertest';

import { NetworkStatus } from '../errors/enums/newtroks.status.enum';
import { Server } from '../Server';
import { TEST_ADDR } from '../test/constants';
import { mockChainVaults, setupVaultsHistoricDDB } from '../test/tests.utils';
import { ChartGranularity } from './enums/chart-granularity.enum';

describe('ChartsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    mockChainVaults();
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

      describe('with an invalid address', () => {
        it('returns a 422', async (done) => {
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: 'bc1qa5wkgaew2dkv56kfvj49j0av5nml45x9ek9hz6',
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with an invalid chain', () => {
        it('returns a 422', async (done) => {
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              chain: 'safemoonchain',
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with start but no end', () => {
        it('returns a 422', async (done) => {
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              start: new Date().toISOString(),
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with end but no start', () => {
        it('returns a 422', async (done) => {
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              end: new Date().toISOString(),
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with an invalid time range', () => {
        it('returns a 422', async (done) => {
          const start = new Date().toISOString();
          const end = new Date(Date.now() - 1).toISOString();
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              start,
              end,
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with an invalid granularity', () => {
        it('returns a 422', async (done) => {
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              granularity: 'second',
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with an invalid period', () => {
        it('returns a 422', async (done) => {
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              period: -1,
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with a large time range for HOUR granularity', () => {
        it('returns a 422', async (done) => {
          const start = '2021-05-01T00:00:00.000Z';
          const end = '2021-06-01T00:00:00.000Z';
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              start,
              end,
              granularity: ChartGranularity.HOUR,
              period: 1,
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });

      describe('with a large time range for DAY granularity', () => {
        it('returns a 422', async (done) => {
          const start = '2021-01-01T00:00:00.000Z';
          const end = '2021-06-01T00:00:00.000Z';
          const { body } = await request
            .get('/v2/charts')
            .query({
              id: '0x4206942069420694206942069420694206942069',
              start,
              end,
              granularity: ChartGranularity.DAY,
              period: 1,
            })
            .expect(UnprocessableEntity.STATUS);

          expect(body).toMatchSnapshot();
          done();
        });
      });
    });

    describe('with an unsupported address', () => {
      it('returns a 404', async (done) => {
        const { body } = await request
          .get('/v2/charts')
          .query({
            id: '0x4206942069420694206942069420694206942069',
          })
          .expect(NotFound.STATUS);

        expect(body).toMatchSnapshot();
        done();
      });
    });
  });

  describe('GET /v3/charts/vault', () => {
    describe('with a missing vault address', () => {
      it('returns 400, QueryParamError', async () => {
        const { body } = await request.get('/v3/charts/vault').expect(NetworkStatus.BadRequest);

        expect(body).toMatchSnapshot();
      });
    });

    describe('get vault data with different timeframes', () => {
      it('should return vault data for YTD', async () => {
        setupVaultsHistoricDDB();

        const { body } = await request
          .get(`/v3/charts/vault?address=${TEST_ADDR}&timeframe=${ChartTimeFrame.YTD}`)
          .expect(NetworkStatus.Success);

        expect(body).toMatchSnapshot();
      });

      it('should return vault data for 1Y', async () => {
        setupVaultsHistoricDDB();

        const { body } = await request
          .get(`/v3/charts/vault?address=${TEST_ADDR}&timeframe=${ChartTimeFrame.Year}`)
          .expect(NetworkStatus.Success);

        expect(body).toMatchSnapshot();
      });
    });
  });
});
