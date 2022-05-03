import { ethers } from 'ethers';
import { getAccounts, getLatestMetadata, getUserAccounts, toVaultBalance } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { getChainStartBlockKey, getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ClaimableBalance } from '../rewards/entities/claimable-balance';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { getClaimableRewards, getTreeDistribution } from '../rewards/rewards.utils';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { batchRefreshAccounts, chunkArray } from './indexer.utils';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { AccountIndexMode } from './enums/account-index-mode.enum';
import { AccountIndexEvent } from './interfaces/account-index-event.interface';
import { Network, RegistryKey } from '@badger-dao/sdk';

export async function refreshClaimableBalances(chain: Chain) {
  const mapper = getDataMapper();
  const distribution = await getTreeDistribution(chain);
  const sdk = await chain.getSdk();

  const badgerTree = await sdk.registry.get(RegistryKey.BadgerTree);
  if (!distribution || !badgerTree) {
    return;
  }

  const latestMetadata = await getLatestMetadata(chain);
  console.log(`Updating Claimable Balances for ${chain.network}`);
  console.log(latestMetadata);
  const { endBlock } = latestMetadata;
  const snapshotStartBlock = endBlock + 1;
  const snapshotEndBlock = await chain.provider.getBlockNumber();

  if (snapshotEndBlock <= snapshotStartBlock) {
    throw new Error(`${chain} invalid snapshot period (${snapshotStartBlock} - ${snapshotEndBlock})`);
  }

  const chainUsers = await getAccounts(chain);
  const results = await getClaimableRewards(chain, chainUsers, distribution, endBlock);

  let pageId = 0;
  const userClaimSnapshots = [];
  for (const res of results) {
    const [user, result] = res;
    const [tokens, amounts] = result;
    const claimableBalances = tokens.map((token, i) => {
      const amount = amounts[i];
      return Object.assign(new ClaimableBalance(), {
        address: token,
        balance: amount.toString(),
      });
    });
    const snapshot = Object.assign(new UserClaimSnapshot(), {
      chainStartBlock: getChainStartBlockKey(chain, snapshotStartBlock),
      chain: chain.network,
      startBlock: snapshotStartBlock,
      address: user,
      claimableBalances,
      pageId: pageId++,
    });
    userClaimSnapshots.push(snapshot);
  }

  console.log(`Updated ${userClaimSnapshots.length} claimable balances for ${chain.network}`);
  for await (const _item of mapper.batchPut(userClaimSnapshots)) {
  }

  // Create new metadata entry after user claim snapshots are calculated
  const metadata = Object.assign(new UserClaimMetadata(), {
    chainStartBlock: getChainStartBlockKey(chain, snapshotStartBlock),
    chain: chain.network,
    startBlock: snapshotStartBlock,
    endBlock: snapshotEndBlock,
    cycle: distribution.cycle,
    count: userClaimSnapshots.length,
  });

  const saved = await mapper.put(metadata);
  console.log(`Completed balance snapshot for ${chain.network} up to ${snapshotEndBlock}`);
  console.log(saved);
}

export async function refreshAccountSettBalances(chain: Chain, batchAccounts: AccountMap) {
  const addresses = Object.keys(batchAccounts);
  const { users } = await getUserAccounts(chain, addresses);
  if (users) {
    for (const user of users) {
      const address = ethers.utils.getAddress(user.id);
      const account = batchAccounts[address];
      if (user) {
        const userBalances = user.settBalances;
        if (userBalances) {
          const balances = userBalances.filter((balance) => {
            try {
              getVaultDefinition(chain, balance.sett.id);
              return true;
            } catch (err) {
              return false;
            }
          });
          const settBalances = await Promise.all(balances.map(async (bal) => toVaultBalance(chain, bal)));
          account.balances = account.balances.filter((bal) => bal.network !== chain.network).concat(settBalances);
        }
      }
      batchAccounts[address] = account;
    }
  }
}

export async function refreshUserAccounts(event: AccountIndexEvent) {
  const { mode } = event;
  console.log(`Invoked refreshUserAccounts in ${mode} mode`);
  const chains = loadChains().filter((c) => c.network !== Network.BinanceSmartChain);
  await Promise.all(
    chains.map(async (chain) => {
      if (mode === AccountIndexMode.BalanceData) {
        const accounts = await getAccounts(chain);
        const refreshFns = chunkArray(accounts, 10).flatMap((chunk) =>
          batchRefreshAccounts(chunk, (batchAccounts) => [refreshAccountSettBalances(chain, batchAccounts)], 100),
        );
        await Promise.all(refreshFns);
      } else {
        try {
          await refreshClaimableBalances(chain);
        } catch (err) {
          console.log(`Failred to refresh claimable balances for ${chain.network}`);
          console.error(err);
        }
      }
    }),
  );

  return 'done';
}
