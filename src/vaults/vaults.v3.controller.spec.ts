import { Network } from '@badger-dao/sdk';
import { BadRequest } from '@tsed/exceptions';
import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { Chain } from '../chains/config/chain.config';
import { NetworkStatus } from '../errors/enums/network-status.enum';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { setupDdbHarvests, setupTestVault } from './vaults.v2.controller.spec';
import { VaultsV3Controller } from './vaults.v3.controller';

describe('vaults.v3.controller', () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [VaultsV3Controller],
    }),
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => setupMockChain());

  describe('GET /vaults/list', () => {
    describe('with no specified chain', () => {
      it('returns eth vaults', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults/list');
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with a specified chain', () => {
      it('returns the requested vaults', async () => {
        setupTestVault();
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/vaults/list')
          .query({ chain: Network.Ethereum });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with an invalid specified chain', () => {
      it('returns a 400', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/vaults/list')
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /vaults/list/harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvest for chain vaults', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get('/vaults/list/harvests');
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('error cases', () => {
      it('returns a 400 for invalid chain', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/vaults/list/harvests')
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /vaults/harvests', () => {
    beforeEach(setupDdbHarvests);

    describe('success cases', () => {
      it('Return extended harvests for chain vault by addr', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/vaults/harvests')
          .query({ address: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
    describe('error cases', () => {
      it('returns a 400 for invalid chain', async () => {
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request.get(
          `/vaults/harvests?vault=${TEST_ADDR}&chain=invalid`,
        );
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /vaults/snapshots', () => {
    describe('success cases', () => {
      it('return 200 and vaults snapshots for all dates, without duplications', async () => {
        const timestampsStr = '1645103004000,1645015261000,1644928124000,1644928124000,1644928124000';
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/snapshots`)
          .query({ timestamps: timestampsStr, chain: Network.Ethereum, vault: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });

      it('return 200 with 1 relevant vault and 2 old snapshots', async () => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/snapshots`)
          .query({ timestamps: timestampsStr, chain: Network.Ethereum, vault: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });

      it('return 200 with empty array, got unmatched data', async () => {
        const timestampsStr = Date.now() * 2;
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/snapshots`)
          .query({ timestamps: timestampsStr, chain: Network.Ethereum, vault: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('error cases', () => {
      it('returns a 400 for invalid chain', async () => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';
        jest.spyOn(Chain, 'getChain').mockImplementation(() => {
          throw new BadRequest(`invalid is not a supported chain`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/snapshots`)
          .query({ timestamps: timestampsStr, chain: 'invalid', vault: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });

      it('returns a 400 for missed vault address param', async () => {
        const timestampsStr = '1645189933000,1634821933000,1634821931000';
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/snapshots`)
          .query({ timestamps: timestampsStr, chain: Network.Ethereum });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });

      it('returns a 400 for invalid timestamps', async () => {
        const timestampsStr = 'Invalid Timestamps';
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/vaults/snapshots`)
          .query({ timestamps: timestampsStr, chain: Network.Ethereum, vault: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
