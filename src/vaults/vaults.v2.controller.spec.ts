import { BadRequest } from '@tsed/exceptions';
import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { Chain } from '../chains/config/chain.config';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { setupDdbHarvests, setupTestVault } from '../test/mocks.utils/mock.api.chain';
import { VaultsV2Controller } from './vaults.v2.controller';

describe('vaults.v2.controller', () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [VaultsV2Controller],
    }),
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => setupMockChain());

  describe('GET /vaults', () => {
    describe('with no specified chain', () => {
      it('returns eth vaults', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults');
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with a specified chain', () => {
      it('returns the vaults for eth', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults?chain=ethereum');

        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });

      it('returns the vaults for bsc', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults?chain=binancesmartchain');
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults').query({ chain: 'invalid' });
        expect(statusCode).toEqual(BadRequest.STATUS);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvest for chain vaults', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults/harvests');
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('error cases', () => {
      it('returns a 400 for invalide chain', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/vaults/harvests')
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(BadRequest.STATUS);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /harvests/:vault', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvests for chain vault by addr', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get(`/vaults/harvests/${TEST_ADDR}`);
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('error cases', () => {
      it('returns a 400 for invalide chain', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/harvests/${TEST_ADDR}`)
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(BadRequest.STATUS);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
