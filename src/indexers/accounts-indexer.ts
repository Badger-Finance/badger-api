import { ethers } from 'ethers';
import { getAccounts, getLatestMetadata, getUserAccounts, toSettBalance } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { getChainStartBlockKey, getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { UserSettBalance } from '../graphql/generated/badger';
import { ClaimableBalance } from '../rewards/entities/claimable-balance';
import { UserClaimSnapshot } from '../rewards/entities/user-claim-snapshot';
import { getClaimableRewards, getTreeDistribution } from '../rewards/rewards.utils';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { batchRefreshAccounts, chunkArray } from './indexer.utils';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { AccountIndexMode } from './enums/account-index-mode.enum';
import { AccountIndexEvent } from './interfaces/account-index-event.interface';
import { Network } from '@badger-dao/sdk';

export async function refreshClaimableBalances(chain: Chain) {
  const mapper = getDataMapper();
  const distribution = await getTreeDistribution(chain);

  if (!distribution || !chain.badgerTree) {
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
      startBlock: snapshotStartBlock,
      address: user,
      claimableBalances,
    });
  });

  console.log(`Updated ${userClaimSnapshots.length} claimable balances for ${chain.network}`);
  for await (const _item of mapper.batchPut(userClaimSnapshots)) {
    if (_item.address === '0xdE0AEf70a7ae324045B7722C903aaaec2ac175F5' && chain.network === Network.Ethereum) {
      console.log(_item);
    }
  }

  // Create new metadata entry after user claim snapshots are calculated
  const metadata = Object.assign(new UserClaimMetadata(), {
    chainStartBlock: getChainStartBlockKey(chain, snapshotStartBlock),
    chain: chain.network,
    startBlock: snapshotStartBlock,
    endBlock: snapshotEndBlock,
    cycle: distribution.cycle,
  });

  const saved = await mapper.put(metadata);
  console.log(`Completed balance snapshot for ${chain.network} up to ${snapshotEndBlock}`);
  console.log(saved);
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

export async function refreshUserAccounts(event: AccountIndexEvent) {
  const { mode } = event;
  console.log(`Invoked refreshUserAccounts in ${mode} mode`);
  const chains = loadChains();
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
          console.error(err);
        }
      }
    }),
  );
}
