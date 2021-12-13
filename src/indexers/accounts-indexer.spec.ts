import * as accountsIndexer from './accounts-indexer';
import * as accountsUtils from '../accounts/accounts.utils';
import * as indexerUtils from './indexer.utils';
import * as rewardsUtils from '../rewards/rewards.utils';
import { Network } from '@badger-dao/sdk';
import { AccountIndexMode } from './enums/account-index-mode.enum';
import { Chain } from '../chains/config/chain.config';
import { ethers } from 'ethers';
import { MOCK_DISTRIBUTION_FILE } from '../test/constants';
import { Ethereum } from '../chains/config/eth.config';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { RewardMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';
import { BigNumber } from '@ethersproject/bignumber';
import { TOKENS } from '../config/tokens.config';
import { mockBatchPut } from '../test/tests.utils';
import { UserClaimSnapshot } from '../rewards/entities/user-claim-snapshot';
import { ClaimableBalance } from '../rewards/entities/claimable-balance';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { DataMapper } from '@aws/dynamodb-data-mapper';

describe('accounts-indexer', () => {
  const rewardsChain = new Ethereum();
  const noRewardsChain = new BinanceSmartChain();
  const networks = [Network.Ethereum, Network.BinanceSmartChain, Network.Polygon, Network.Arbitrum];
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
      if (!chain.badgerTree) {
        return null;
      }
      return MOCK_DISTRIBUTION_FILE;
    });
    getLatestMetadata = jest.spyOn(indexerUtils, 'getLatestMetadata').mockImplementation(async (chain: Chain) => {
      return Object.assign(new UserClaimMetadata(), {
        startBlock: startMockedBlockNumber,
        endBlock: endMockedBlockNumber,
        chainStartBlock: `${chain.network}_123123`,
        chain: chain.network,
      });
    });
    jest
      .spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBlockNumber')
      .mockImplementation(() => Promise.resolve(endMockedBlockNumber));
  });

  describe('refreshUserAccounts', () => {
    it('calls refreshAccountClaimableBalances for each chain separately', async () => {
      const batchRefresh = jest.spyOn(indexerUtils, 'batchRefreshAccounts').mockImplementation(() => Promise.resolve());
      await accountsIndexer.refreshUserAccounts({ mode: AccountIndexMode.ClaimableBalanceData });
      const chainCallData = batchRefresh.mock.calls.flatMap((calls) => calls[0]);
      expect(chainCallData).toEqual(networks);
    });
    it('calls refreshAccountSettBalances for each chain separately', async () => {
      const batchRefresh = jest.spyOn(indexerUtils, 'batchRefreshAccounts').mockImplementation(() => Promise.resolve());
      await accountsIndexer.refreshUserAccounts({ mode: AccountIndexMode.BalanceData });
      const chainCallData = batchRefresh.mock.calls.flatMap((calls) => calls[0]);
      expect(chainCallData).toEqual(networks);
    });
  });

  describe('refreshClaimableBalances', () => {
    it('takes no action on chains with no rewards', async () => {
      await accountsIndexer.refreshClaimableBalances(noRewardsChain);
      expect(getTreeDistribution.mock.calls.length).toEqual(1);
      expect(getTreeDistribution.mock.calls[0][0]).toMatchObject(noRewardsChain);
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
      const expected = testAccounts.map((acc) =>
        Object.assign(new UserClaimSnapshot(), {
          chainStartBlock: `${rewardsChain.network}_123123`,
          address: acc,
          network: rewardsChain.network,
          claimableBalances,
        }),
      );
      const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
      const expectedMetadata = Object.assign(new UserClaimMetadata(), {
        // startBlock for next stored metaData obj should be endBlock value of the previous metaData entity
        startBlock: endMockedBlockNumber,
        endBlock: (await rewardsChain.provider.getBlockNumber()) + 1,
        chainStartBlock: `${rewardsChain.network}_${await rewardsChain.provider.getBlockNumber()}`,
        chain: rewardsChain.network,
      });
      const batchPut = mockBatchPut(expected);
      await accountsIndexer.refreshClaimableBalances(rewardsChain);
      // verify tree distribution was loaded, and the proper chain was called
      expect(getTreeDistribution.mock.calls.length).toEqual(1);
      expect(getTreeDistribution.mock.calls[0][0]).toMatchObject(rewardsChain);
      // verify get accounts was called, and the proper expected accounts were returned
      expect(getAccounts.mock.calls.length).toEqual(1);
      expect(getAccounts.mock.calls[0][0]).toMatchObject(rewardsChain);
      expect(getLatestMetadata.mock.calls.length).toEqual(1);
      expect(put.mock.calls[0][0]).toEqual(expectedMetadata);
      // verify the function calls the update on all expected accounts
      expect(usersChecked).toMatchObject(testAccounts);
      // verify the function saved the expected data on all expected accounts
      expect(batchPut.mock.calls[0][0]).toEqual(expected);
    });
  });
});
