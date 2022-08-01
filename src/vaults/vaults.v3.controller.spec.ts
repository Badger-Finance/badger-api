import { Network } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { TOKENS } from '../config/tokens.config';
import { NetworkStatus } from '../errors/enums/newtroks.status.enum';
import { Server } from '../Server';
import { setupDdbVaultsChartsData, setupVaultsCoumpoundDDB } from '../test/tests.utils';
import { setupDdbHarvests, setupTestVault } from './vaults.v2.controller.spec';

const TEST_VAULT = TOKENS.BCRV_SBTC;
const TEST_CHART_VAULT = TOKENS.BARB_CRV_TRICRYPTO;

describe('VaultsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /v3/vaults/list', () => {
    describe('with no specified chain', () => {
      it('returns eth vaults', async (done: jest.DoneCallback) => {
        setupVaultsCoumpoundDDB();
        setupTestVault();
        const { body } = await request.get('/v3/vaults/list').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with a specified chain', () => {
      it('returns the vaults for eth', async (done: jest.DoneCallback) => {
        setupVaultsCoumpoundDDB();
        setupTestVault();
        const { body } = await request.get('/v3/vaults/list?chain=ethereum').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns the vaults for polygon', async (done: jest.DoneCallback) => {
        setupVaultsCoumpoundDDB();
        setupTestVault();
        const { body } = await request.get('/v3/vaults/list?chain=polygon').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v3/vaults/list?chain=invalid').expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });

  describe('GET /v3/vaults/list/harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvest for chain vaults', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v3/vaults/list/harvests').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalide chain', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v3/vaults/list/harvests?chain=invalid').expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });

  describe('GET /v3/vaults/harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvests for chain vault by addr', async (done: jest.DoneCallback) => {
        const { body } = await request.get(`/v3/vaults/harvests?vault=${TEST_VAULT}`).expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalide chain', async (done: jest.DoneCallback) => {
        const { body } = await request
          .get(`/v3/vaults/harvests?vault=${TEST_VAULT}&chain=invalid`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });

  describe('GET /v3/vaults/inrange/snapshots', () => {
    beforeEach(setupDdbVaultsChartsData);

    describe('success cases', () => {
      it('return 200 and vaults snapshots for all dates, without duplications', async (done: jest.DoneCallback) => {
        const timestampsStr = '1645103004000,1645015261000,1644928124000,1644928124000,1644928124000';

        const { body } = await request
          .get(
            `/v3/vaults/inrange/snapshots?vaultAddr=${TEST_CHART_VAULT}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`,
          )
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });

      it('return 200 with 1 relevant vault and 2 old snapshots', async (done: jest.DoneCallback) => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';

        const { body } = await request
          .get(
            `/v3/vaults/inrange/snapshots?vaultAddr=${TEST_CHART_VAULT}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`,
          )
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });

      it('return 200 with empty array, got unmached data', async (done: jest.DoneCallback) => {
        const timestampsStr = Date.now() * 2;

        const { body } = await request
          .get(
            `/v3/vaults/inrange/snapshots?vaultAddr=${TEST_CHART_VAULT}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`,
          )
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('error cases', () => {
      it('returns a 400 for invalide chain', async (done: jest.DoneCallback) => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';

        const { body } = await request
          .get(`/v3/vaults/inrange/snapshots?vaultAddr=${TEST_CHART_VAULT}&timestamps=${timestampsStr}&chain=invalid`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns a 400 for missed vault address param', async (done: jest.DoneCallback) => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';

        const { body } = await request
          .get(`/v3/vaults/inrange/snapshots?timestamps=${timestampsStr}&chain=${Network.Arbitrum}`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
        done();
      });

      it('returns a 400 for invalide timestamps', async (done: jest.DoneCallback) => {
        const timestampsStr = 'Invalid Timestamps';

        const { body } = await request
          .get(
            `/v3/vaults/inrange/snapshots?vaultAddr=${TEST_CHART_VAULT}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`,
          )
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
