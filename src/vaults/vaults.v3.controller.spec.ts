import { Network } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { TOKENS } from '../config/tokens.config';
import { NetworkStatus } from '../errors/enums/network-status.enum';
import { Server } from '../Server';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { setupVaultsCoumpoundDDB } from '../test/tests.utils';
import { setupDdbHarvests, setupTestVault } from './vaults.v2.controller.spec';

const TEST_VAULT = TOKENS.BCRV_SBTC;

describe('VaultsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe('GET /v3/vaults/list', () => {
    describe('with no specified chain', () => {
      it('returns eth vaults', async () => {
        setupVaultsCoumpoundDDB();
        setupTestVault();
        const { body } = await request.get('/v3/vaults/list').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with a specified chain', () => {
      it('returns the vaults for eth', async () => {
        setupVaultsCoumpoundDDB();
        setupTestVault();
        const { body } = await request.get('/v3/vaults/list?chain=ethereum').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });

      it('returns the vaults for polygon', async () => {
        setupVaultsCoumpoundDDB();
        setupTestVault();
        const { body } = await request.get('/v3/vaults/list?chain=polygon').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async () => {
        const { body } = await request.get('/v3/vaults/list?chain=invalid').expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });
    });
  });

  describe('GET /v3/vaults/list/harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvest for chain vaults', async () => {
        const { body } = await request.get('/v3/vaults/list/harvests').expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalide chain', async () => {
        const { body } = await request.get('/v3/vaults/list/harvests?chain=invalid').expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });
    });
  });

  describe('GET /v3/vaults/harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvests for chain vault by addr', async () => {
        const { body } = await request.get(`/v3/vaults/harvests?vault=${TEST_VAULT}`).expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalide chain', async () => {
        const { body } = await request
          .get(`/v3/vaults/harvests?vault=${TEST_VAULT}&chain=invalid`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });
    });
  });

  describe('GET /v3/vaults/snapshots', () => {
    beforeEach(async () => {
      // setupDdbVaultsChartsData();
      setupMockChain();
    });

    describe('success cases', () => {
      it('return 200 and vaults snapshots for all dates, without duplications', async () => {
        const timestampsStr = '1645103004000,1645015261000,1644928124000,1644928124000,1644928124000';

        const { body } = await request
          .get(`/v3/vaults/snapshots?vault=${TEST_ADDR}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`)
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });

      it('return 200 with 1 relevant vault and 2 old snapshots', async () => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';

        const { body } = await request
          .get(`/v3/vaults/snapshots?vault=${TEST_ADDR}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`)
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });

      it('return 200 with empty array, got unmached data', async () => {
        const timestampsStr = Date.now() * 2;

        const { body } = await request
          .get(`/v3/vaults/snapshots?vault=${TEST_ADDR}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`)
          .expect(NetworkStatus.Success);
        expect(body).toMatchSnapshot();
      });
    });

    describe('error cases', () => {
      it('returns a 400 for invalide chain', async () => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';

        const { body } = await request
          .get(`/v3/vaults/snapshots?vault=${TEST_ADDR}&timestamps=${timestampsStr}&chain=invalid`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });

      it('returns a 400 for missed vault address param', async () => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';

        const { body } = await request
          .get(`/v3/vaults/snapshots?timestamps=${timestampsStr}&chain=${Network.Arbitrum}`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });

      it('returns a 400 for invalide timestamps', async () => {
        const timestampsStr = 'Invalid Timestamps';

        const { body } = await request
          .get(`/v3/vaults/snapshots?vault=${TEST_ADDR}&timestamps=${timestampsStr}&chain=${Network.Arbitrum}`)
          .expect(NetworkStatus.BadRequest);
        expect(body).toMatchSnapshot();
      });
    });
  });
});
