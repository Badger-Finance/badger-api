import { PlatformTest } from '@tsed/common';

import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamodbUtils from '../aws/dynamodb.utils';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { setupMapper, TEST_ADDR, TEST_CHAIN } from '../test/tests.utils';
import { UserClaimMetadata } from './entities/user-claim-metadata';
import { RewardsService } from './rewards.service';
import * as rewardsUtils from './rewards.utils';

describe('rewards.service', () => {
  let service: RewardsService;

  beforeEach(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<RewardsService>(RewardsService);
  });

  afterEach(PlatformTest.reset);

  describe('getUserRewards', () => {
    it('throws a bad request on chains with no rewards', async () => {
      jest.spyOn(rewardsUtils, 'getTreeDistribution').mockImplementation(async (_chain: Chain) => null);
      await expect(service.getUserRewards(TEST_CHAIN, TEST_ADDR)).rejects.toThrow(
        `${TEST_CHAIN.name} is not supportable for request`,
      );
    });
  });

  describe('list', () => {
    it('returns a chunk of claimable snapshots', async () => {
      const previousMockedBlockNumber = 90;
      const startMockedBlockNumber = 100;
      jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain: Chain) => {
        return Object.assign(new UserClaimMetadata(), {
          chainStartBlock: dynamodbUtils.getChainStartBlockKey(TEST_CHAIN, previousMockedBlockNumber),
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

      const { records } = await service.list({ chain: TEST_CHAIN });
      expect(records).toEqual(entries);
    });
  });
});
