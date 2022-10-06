import { BadRequest, NotFound } from '@tsed/exceptions';
import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { Chain } from '../chains/config/chain.config';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import { NetworkStatus } from '../errors/enums/network-status.enum';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { randomClaimSnapshots } from '../test/mocks.utils/mock.helpers';
import { RewardsService } from './rewards.service';
import { RewardsV3Controller } from './rewards.v3.controller';

describe('rewards.v3.controller', () => {
  const claimAmounts = 40;

  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [RewardsV3Controller],
    }),
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(() => {
    setupMockChain();
    const records = randomClaimSnapshots(claimAmounts);
    jest.spyOn(RewardsService.prototype, 'list').mockImplementation(async () => ({
      count: claimAmounts,
      records,
    }));
  });

  describe('getBadgerTreeReward', () => {
    it('returns requested address claim', async () => {
      const { body, statusCode } = await PlatformServerlessTest.request
        .get(`/rewards/tree`)
        .query({ address: TEST_ADDR });
      expect(statusCode).toEqual(NetworkStatus.Success);
      expect(JSON.parse(body)).toMatchSnapshot();
    });

    it('throws an error for no requested address', async () => {
      const { body, statusCode } = await PlatformServerlessTest.request.get(`/rewards/tree`);
      expect(statusCode).toEqual(NetworkStatus.BadRequest);
      expect(JSON.parse(body)).toMatchSnapshot();
    });
  });

  describe('list', () => {
    it('returns page zero with default page size per page with no query params', async () => {
      const { body, statusCode } = await PlatformServerlessTest.request.get('/rewards/list');
      expect(statusCode).toEqual(NetworkStatus.Success);
      expect(JSON.parse(body)).toMatchSnapshot();
    });
  });

  describe('GET /v3/rewards/schedules/list', () => {
    describe('with no specified chain', () => {
      it('returns schedules for default chain and all vaults', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request.get('/rewards/schedules/list');
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with active param true', () => {
      it('returns active schedules for default chain and all vaults', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get('/rewards/schedules/list')
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
          .get('/rewards/schedules/list')
          .query({ chain: 'invalid' });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });

  describe('GET /v3/rewards/schedules', () => {
    describe('with no specified chain', () => {
      it('returns schedule for default chain and one vault', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/rewards/schedules`)
          .query({ address: TEST_ADDR });
        expect(statusCode).toEqual(NetworkStatus.Success);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with active param true', () => {
      it('returns schedules for default chain and one vault', async () => {
        const { body, statusCode } = await PlatformServerlessTest.request
          .get(`/rewards/schedules`)
          .query({ address: TEST_ADDR, active: true });
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
          .get(`/rewards/schedules`)
          .query({ address: TEST_ADDR, chain: 'invalid' });
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });

    describe('with invalid param specified', () => {
      it('returns a 400', async () => {
        jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (v) => {
          throw new NotFound(`No vault exists with address ${v}`);
        });
        const { body, statusCode } = await PlatformServerlessTest.request.get(`/rewards/schedules`);
        expect(statusCode).toEqual(NetworkStatus.BadRequest);
        expect(JSON.parse(body)).toMatchSnapshot();
      });
    });
  });
});
