import { BadRequest } from '@tsed/exceptions';
import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { Chain } from '../chains/config/chain.config';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import { NetworkStatus } from '../errors/enums/network-status.enum';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { RewardV2Controller } from './reward.v2.controller';

describe('reward.v2.controller', () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [RewardV2Controller],
    }),
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => setupMockChain());

  describe('GET /v2/reward/tree/:address', () => {
    describe('request user with saved claims', () => {
      it('returns requested address claim', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get(`/reward/tree/${TEST_ADDR}`);
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /v2/reward/schedules', () => {
    describe('with no specified chain', () => {
      it('returns schedules for default chain and all vaults', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get('/reward/schedules');
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with active param true', () => {
      it('returns active schedules for default chain and all vaults', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/reward/schedules')
          .query({ active: true });
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
          .get('/reward/schedules')
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /v2/reward/schedules/<beneficiary>', () => {
    describe('with no specified chain', () => {
      it('returns schedule for default chain and one vault', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get(`/reward/schedules/${TEST_ADDR}`);
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with active param true', () => {
      it('returns schedules for default chain and one vault', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/reward/schedules/${TEST_ADDR}`)
          .query({ active: true });
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
          .get(`/reward/schedules/${TEST_ADDR}`)
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with invalid param specified', () => {
      it('returns a 400, NotFound', async () => {
        jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => {
          throw new Error('Missing Vault');
        });
        const { body, statusCode } = await PlatformServerlessTest.request.get(`/reward/schedules/unknowsvaultdata`);
        expect(statusCode).toEqual(NetworkStatus.NotFound);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
