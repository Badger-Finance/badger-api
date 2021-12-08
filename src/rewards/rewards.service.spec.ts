import { PlatformTest } from '@tsed/common';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Chain } from '../chains/config/chain.config';
import { MOCK_DISTRIBUTION_FILE } from '../test/constants';
import { TEST_ADDR } from '../test/tests.utils';
import { RewardsService } from './rewards.service';
import * as rewardsUtils from './rewards.utils';

describe('rewards.service', () => {
  let service: RewardsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<RewardsService>(RewardsService);
    jest.spyOn(rewardsUtils, 'getTreeDistribution').mockImplementation(async (chain: Chain) => {
      if (!chain.badgerTree) {
        return null;
      }
      return MOCK_DISTRIBUTION_FILE;
    });
  });

  afterEach(PlatformTest.reset);

  describe('getUserRewards', () => {
    it('throws a bad request on chains with no rewards', async () => {
      const chain = new BinanceSmartChain();
      await expect(service.getUserRewards(chain, TEST_ADDR)).rejects.toThrow(
        `${chain.name} does not support claimable rewards.`,
      );
    });
  });
});
