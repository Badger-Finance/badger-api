import { Network } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamodbUtils from '../aws/dynamodb.utils';
import { UserClaimMetadata } from '../aws/models/user-claim-metadata.model';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { TEST_ADDR } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { RewardsService } from './rewards.service';

describe('rewards.service', () => {
  let service: RewardsService;

  beforeEach(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<RewardsService>(RewardsService);
  });

  afterEach(PlatformTest.reset);

  describe('getUserRewards', () => {
    it('throws a bad request on chains with no rewards', async () => {
      const chain = setupMockChain({ network: Network.Arbitrum });
      await expect(service.getUserRewards(chain, TEST_ADDR)).rejects.toThrow(
        `${chain.network} is not supportable for request`,
      );
    });
  });

  describe('list', () => {
    it('returns a chunk of claimable snapshots', async () => {
      const chain = setupMockChain();
      const previousMockedBlockNumber = 90;
      const startMockedBlockNumber = 100;
      jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain: Chain) => {
        const mockMetadata: UserClaimMetadata = {
          chainStartBlock: dynamodbUtils.getChainStartBlockKey(chain.network, previousMockedBlockNumber),
          chain: chain.network,
          startBlock: previousMockedBlockNumber,
          endBlock: startMockedBlockNumber - 1,
          cycle: 10,
          count: 4,
        };
        return Object.assign(new UserClaimMetadata(), mockMetadata);
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
      mockQuery(entries);

      const { records } = await service.list({ chain });
      expect(records).toEqual(entries);
    });
  });
});
