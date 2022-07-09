import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Network } from '@badger-dao/sdk';
import { BigNumber } from '@ethersproject/bignumber';

import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamodbUtils from '../aws/dynamodb.utils';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { ClaimableBalance } from '../rewards/entities/claimable-balance';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { RewardMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';
import * as rewardsUtils from '../rewards/rewards.utils';
import { MOCK_DISTRIBUTION_FILE } from '../test/constants';
import { mockBatchPut, TEST_CHAIN } from '../test/tests.utils';
import * as accountsIndexer from './accounts-indexer';

describe('accounts-indexer', () => {
  const previousMockedBlockNumber = 90;
  const startMockedBlockNumber = 100;
  const endMockedBlockNumber = 110;
  let getAccounts: jest.SpyInstance<Promise<string[]>, [chain: Chain]>;
  let getLatestMetadata: jest.SpyInstance<Promise<UserClaimMetadata>, [chain: Chain]>;
  let getTreeDistribution: jest.SpyInstance<Promise<RewardMerkleDistribution | null>, [chain: Chain]>;

  beforeEach(() => {
    // utilize getAccounts as a canary for detecting the network calls being made
    getAccounts = jest
      .spyOn(accountsUtils, 'getAccounts')
      .mockImplementation((chain) => Promise.resolve([chain.network]));
    getTreeDistribution = jest.spyOn(rewardsUtils, 'getTreeDistribution').mockImplementation(async (chain: Chain) => {
      if (chain.network !== Network.Ethereum) {
        return null;
      }
      return MOCK_DISTRIBUTION_FILE;
    });
    getLatestMetadata = jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain: Chain) => {
      return Object.assign(new UserClaimMetadata(), {
        chainStartBlock: dynamodbUtils.getChainStartBlockKey(TEST_CHAIN, previousMockedBlockNumber),
        chain: chain.network,
        startBlock: previousMockedBlockNumber,
        endBlock: startMockedBlockNumber - 1,
      });
    });
    jest.spyOn(TEST_CHAIN.provider, 'getBlockNumber').mockImplementation(async () => endMockedBlockNumber);
  });

  describe('refreshClaimableBalances', () => {
    it('takes no action on chains with no rewards', async () => {
      jest.spyOn(Chain.prototype, 'getSdk').mockImplementation(async () => TEST_CHAIN.sdk);
      await accountsIndexer.refreshClaimableBalances(TEST_CHAIN);
      expect(getTreeDistribution.mock.calls.length).toEqual(1);
      expect(getTreeDistribution.mock.calls[0][0]).toMatchObject(TEST_CHAIN);
      expect(getAccounts.mock.calls.length).toEqual(0);
    });

    it('looks up all user claimable balances on chains with rewards and persists them', async () => {
      const testAccounts = [TOKENS.WBTC, TOKENS.DAI, TOKENS.WETH, TOKENS.USDT, TOKENS.USDC];
      jest.spyOn(accountsUtils, 'getAccounts').mockImplementation((_chain) => Promise.resolve(testAccounts));
      const claimableResults: [string[], BigNumber[]] = [
        [TOKENS.BADGER, TOKENS.DIGG],
        [BigNumber.from(10000), BigNumber.from(12)],
      ];
      let usersChecked;
      jest
        .spyOn(rewardsUtils, 'getClaimableRewards')
        .mockImplementation(async (_chain: Chain, chainUsers: string[], _distribution: RewardMerkleDistribution) => {
          usersChecked = chainUsers;
          return chainUsers.map((u) => [u, claimableResults]);
        });
      const [tokens, amounts] = claimableResults;
      const claimableBalances = tokens.map((token, i) => {
        const amount = amounts[i];
        return Object.assign(new ClaimableBalance(), {
          address: token,
          balance: amount.toString(),
        });
      });

      let pageId = 0;
      const expected = [];
      for (const acc of testAccounts) {
        expected.push(
          Object.assign(new UserClaimSnapshot(), {
            chainStartBlock: dynamodbUtils.getChainStartBlockKey(TEST_CHAIN, startMockedBlockNumber),
            chain: TEST_CHAIN.network,
            startBlock: startMockedBlockNumber,
            address: acc,
            claimableBalances,
            pageId: pageId++,
          }),
        );
      }
      const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
      const expectedMetadata = Object.assign(new UserClaimMetadata(), {
        // startBlock for next stored metaData obj should be endBlock + 1 value of the previous metaData entity
        chainStartBlock: dynamodbUtils.getChainStartBlockKey(TEST_CHAIN, startMockedBlockNumber),
        chain: TEST_CHAIN.network,
        startBlock: startMockedBlockNumber,
        endBlock: endMockedBlockNumber,
        cycle: MOCK_DISTRIBUTION_FILE.cycle,
        count: expected.length,
      });
      const batchPut = mockBatchPut(expected);
      await accountsIndexer.refreshClaimableBalances(TEST_CHAIN);
      // verify tree distribution was loaded, and the proper chain was called
      expect(getTreeDistribution.mock.calls.length).toEqual(1);
      expect(getTreeDistribution.mock.calls[0][0]).toMatchObject(TEST_CHAIN);
      // verify get accounts was called, and the proper expected accounts were returned
      expect(getAccounts.mock.calls.length).toEqual(1);
      expect(getAccounts.mock.calls[0][0]).toMatchObject(TEST_CHAIN);
      expect(getLatestMetadata.mock.calls.length).toEqual(1);
      expect(put.mock.calls[0][0]).toEqual(expectedMetadata);
      // verify the function calls the update on all expected accounts
      expect(usersChecked).toMatchObject(testAccounts);
      // verify the function saved the expected data on all expected accounts
      expect(batchPut.mock.calls[0][0]).toEqual(expected);
    });
  });
});
