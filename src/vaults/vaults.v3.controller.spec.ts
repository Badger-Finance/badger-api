import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { TOKENS } from '../config/tokens.config';
import { NetworkStatus } from '../errors/enums/newtroks.status.enum';
import { Server } from '../Server';
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
});
