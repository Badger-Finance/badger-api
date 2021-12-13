import { ethers } from 'ethers';
import { getAccounts, getUserAccounts, toSettBalance } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { UserSettBalance } from '../graphql/generated/badger';
import { ClaimableBalance } from '../rewards/entities/claimable-balance';
import { UserClaimSnapshot } from '../rewards/entities/user-claim-snapshot';
import { getChainStartBlockKey, getClaimableRewards, getTreeDistribution } from '../rewards/rewards.utils';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { batchRefreshAccounts, chunkArray, getLatestMetadata } from './indexer.utils';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';

export async function refreshClaimableBalances(chain: Chain) {
  const mapper = getDataMapper();
  const distribution = await getTreeDistribution(chain);

  if (!distribution || !chain.badgerTree) {
    return;
  }

  const { endBlock } = await getLatestMetadata(chain);
  const snapshotStartBlock = endBlock + 1;
  const snapshotEndBlock = await chain.provider.getBlockNumber();

  const chainUsers = await getAccounts(chain);
  const results = await getClaimableRewards(chain, chainUsers, distribution, endBlock);
  const userClaimSnapshots = results.map((res) => {
    const [user, result] = res;
    const [tokens, amounts] = result;
    const claimableBalances = tokens.map((token, i) => {
      const amount = amounts[i];
      return Object.assign(new ClaimableBalance(), {
        address: token,
        balance: amount.toString(),
      });
    });
    return Object.assign(new UserClaimSnapshot(), {
      chainStartBlock: getChainStartBlockKey(chain, snapshotStartBlock),
      chain: chain.network,
      address: user,
      claimableBalances,
    });
  });

  for await (const _item of mapper.batchPut(userClaimSnapshots)) {
  }

  // Create new metadata entry after user claim snapshots are calculated
  const metaData = Object.assign(new UserClaimMetadata(), {
    chainStartBlock: getChainStartBlockKey(chain, snapshotStartBlock),
    chain: chain.network,
    startBlock: snapshotStartBlock,
    endBlock: snapshotEndBlock,
  });
  await mapper.put(metaData);
}

export async function refreshAccountSettBalances(chain: Chain, batchAccounts: AccountMap) {
  const addresses = Object.keys(batchAccounts);
  const response = await getUserAccounts(chain, addresses);
  for (const user of response.users) {
    const address = ethers.utils.getAddress(user.id);
    const account = batchAccounts[address];
    if (user) {
      const userBalances = user.settBalances as UserSettBalance[];
      if (userBalances) {
        const balances = userBalances.filter((balance) => {
          try {
            getVaultDefinition(chain, balance.sett.id);
            return true;
          } catch (err) {
            return false;
          }
        });
        const settBalances = await Promise.all(balances.map(async (bal) => toSettBalance(chain, bal)));
        account.balances = account.balances.filter((bal) => bal.network !== chain.network).concat(settBalances);
      }
    }
    batchAccounts[address] = account;
  }
}

export async function refreshUserAccounts() {
  const chains = loadChains();
  await Promise.all(
    chains.map(async (chain) => {
      const accounts = await getAccounts(chain);
      const refreshFns = chunkArray(accounts, 10).flatMap((chunk) =>
        batchRefreshAccounts(chunk, (batchAccounts) => [refreshAccountSettBalances(chain, batchAccounts)], 100),
      );
      await Promise.all(refreshFns);
    }),
  );
}
