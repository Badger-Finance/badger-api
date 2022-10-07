import { PlatformTest } from '@tsed/common';

import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamodbUtils from '../aws/dynamodb.utils';
import { UserClaimMetadata } from '../aws/models/user-claim-metadata.model';
import * as s3Utils from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { MOCK_DISTRIBUTION_FILE, TEST_ADDR } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { randomClaimSnapshots } from '../test/mocks.utils/mock.helpers';
import { RewardsService } from './rewards.service';

describe('rewards.service', () => {
  let service: RewardsService;
  let chain: Chain;

  beforeEach(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<RewardsService>(RewardsService);
    chain = setupMockChain();
  });

  afterEach(PlatformTest.reset);

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
      const snapshots = randomClaimSnapshots(5);
      mockQuery(snapshots);

      const { records } = await service.list({ chain });
      expect(records).toEqual(snapshots);
    });
  });

  describe('getUserRewards', () => {
    it('returns user claim data when available', async () => {
      const rewards = await service.getUserRewards(chain, TEST_ADDR);
      expect(rewards).toMatchObject(MOCK_DISTRIBUTION_FILE.claims[TEST_ADDR]);
    });

    it('throws an error on a missing distribution file', async () => {
      jest.spyOn(s3Utils, 'getTreeDistribution').mockImplementation(async () => null);
      await expect(service.getUserRewards(chain, TEST_ADDR)).rejects.toThrow(
        `${chain.network} is not supportable for request`,
      );
    });

    it('throws an error on missing requested address data', async () => {
      await expect(service.getUserRewards(chain, TOKENS.DIGG)).rejects.toThrow(
        `No data for specified address: ${TOKENS.DIGG}`,
      );
    });
  });
});
