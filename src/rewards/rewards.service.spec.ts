import { PlatformTest } from '@tsed/common';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Chain } from '../chains/config/chain.config';
import { MOCK_DISTRIBUTION_FILE } from '../test/fixtures';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { RewardsService } from './rewards.service';
import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamodbUtils from '../aws/dynamodb.utils';
import * as rewardsUtils from './rewards.utils';
import { Ethereum } from '../chains/config/eth.config';
import { UserClaimMetadata } from './types/user-claim-metadata';
import { UserClaimSnapshot } from './types/user-claim-snapshot';

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

  describe('list', () => {
    it('returns a chunk of claimable snapshots', async () => {
      const rewardsChain = new Ethereum();
      const previousMockedBlockNumber = 90;
      const startMockedBlockNumber = 100;
      jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain: Chain) => {
        return Object.assign(new UserClaimMetadata(), {
          chainStartBlock: dynamodbUtils.getChainStartBlockKey(rewardsChain, previousMockedBlockNumber),
          chain: chain.network,
          startBlock: previousMockedBlockNumber,
          endBlock: startMockedBlockNumber - 1,
        });
      });
      const entries: UserClaimSnapshot[] = [
        {
          address: '0x0',
          chain: 'eth',
          chainStartBlock: '0',
          claimableBalances: [],
          expiresAt: 0,
          pageId: 0,
          startBlock: 0,
        },
      ];
      setupMapper(entries);

      const { records } = await service.list({ chain: rewardsChain });
      expect(records).toEqual(entries);
    });
  });
});
