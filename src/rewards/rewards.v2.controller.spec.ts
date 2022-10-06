import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { NetworkStatus } from '../errors/enums/network-status.enum';
import { setupMockChain } from '../test/mocks.utils';
import { randomClaimSnapshots } from '../test/mocks.utils/mock.helpers';
import { RewardsService } from './rewards.service';
import { RewardsV2Controller } from './rewards.v2.controller';

describe('rewards.v2.controller', () => {
  const claimAmounts = 40;

  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [RewardsV2Controller],
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

  describe('list', () => {
    it('returns page zero with default page size per page with no query params', async () => {
      const { body, statusCode } = await PlatformServerlessTest.request.get('/rewards');
      expect(statusCode).toEqual(NetworkStatus.Success);
      expect(JSON.parse(body)).toMatchSnapshot();
    });
  });
});
