import { DataMapper } from '@aws/dynamodb-data-mapper';
import { RewardsService } from '@badger-dao/sdk';
import { BigNumber } from 'ethers';

import * as accountsUtils from '../accounts/accounts.utils';
import { getChainStartBlockKey } from '../aws/dynamodb.utils';
import { ClaimableBalance } from '../aws/models/claimable-balance.model';
import { UserClaimMetadata } from '../aws/models/user-claim-metadata.model';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { RewardMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';
import * as rewardsUtils from '../rewards/rewards.utils';
import { MOCK_DISTRIBUTION_FILE, TEST_CURRENT_BLOCK } from '../test/constants';
import { mockBatchPut, setupMockChain } from '../test/mocks.utils';
import { refreshClaimableBalances } from './accounts-indexer';

describe('accounts-indexer', () => {
  let chain: Chain;

  const endMockedBlockNumber = TEST_CURRENT_BLOCK;
  const startMockedBlockNumber = endMockedBlockNumber - 100;
  const previousMockedBlockNumber = startMockedBlockNumber - 100;

  let getAccounts: jest.SpyInstance<Promise<string[]>, [chain: Chain]>;
  let getLatestMetadata: jest.SpyInstance<Promise<UserClaimMetadata>, [chain: Chain]>;

  beforeEach(() => {
    chain = setupMockChain();
    jest.spyOn(console, 'log').mockImplementation(jest.fn);
    getAccounts = jest.spyOn(accountsUtils, 'getAccounts').mockImplementation();
    getLatestMetadata = jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain: Chain) => {
      return Object.assign(new UserClaimMetadata(), {
        chainStartBlock: getChainStartBlockKey(chain.network, previousMockedBlockNumber),
        chain: chain.network,
        startBlock: previousMockedBlockNumber,
        endBlock: startMockedBlockNumber - 1,
      });
    });
  });

  describe('refreshClaimableBalances', () => {
    it('takes no action on chains with no rewards', async () => {
      jest.spyOn(RewardsService.prototype, 'hasBadgerTree').mockImplementation(() => false);
      await refreshClaimableBalances(chain);
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
            chainStartBlock: getChainStartBlockKey(chain.network, startMockedBlockNumber),
            chain: chain.network,
            startBlock: startMockedBlockNumber,
            address: acc,
            claimableBalances,
            pageId: pageId++,
          }),
        );
      }
      const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
      const expectedMetadata = Object.assign(new UserClaimMetadata(), {
        chainStartBlock: getChainStartBlockKey(chain.network, startMockedBlockNumber),
        chain: chain.network,
        startBlock: startMockedBlockNumber,
        endBlock: endMockedBlockNumber,
        cycle: MOCK_DISTRIBUTION_FILE.cycle,
        count: expected.length,
      });
      const batchPut = mockBatchPut(expected);
      await refreshClaimableBalances(chain);
      // verify get accounts was called, and the proper expected accounts were returned
      expect(getAccounts.mock.calls.length).toEqual(1);
      expect(getAccounts.mock.calls[0][0]).toMatchObject(chain);
      expect(getLatestMetadata.mock.calls.length).toEqual(1);
      expect(put.mock.calls[0][0]).toEqual(expectedMetadata);
      // verify the function calls the update on all expected accounts
      expect(usersChecked).toMatchObject(testAccounts);
      // verify the function saved the expected data on all expected accounts
      expect(batchPut.mock.calls[0][0]).toEqual(expected);
    });
  });
});
