import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { getAccounts, getLatestMetadata, queryCachedAccount, toVaultBalance } from '../accounts/accounts.utils';
import { getChainStartBlockKey, getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { ClaimableBalance } from '../rewards/entities/claimable-balance';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { getClaimableRewards, getTreeDistribution } from '../rewards/rewards.utils';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { Network } from '@badger-dao/sdk';

export async function refreshClaimableBalances(chain: Chain) {
  const mapper = getDataMapper();
  const distribution = await getTreeDistribution(chain);
  const sdk = await chain.getSdk();

  if (!distribution || !sdk.rewards.hasBadgerTree()) {
    return;
  }

  const latestMetadata = await getLatestMetadata(chain);
  console.log(
    `Updating Claimable Balances for ${chain.network} (prev. ${latestMetadata.startBlock} - ${latestMetadata.endBlock})`,
  );
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

  await mapper.put(metadata);
  console.log(`Completed balance snapshot for ${chain.network} up to ${snapshotEndBlock}`);
}

export async function refreshAccountVaultBalances(chain: Chain, account: string) {
  const sdk = await chain.getSdk();

  const { user } = await sdk.graph.loadUser({ id: account.toLowerCase() });

  if (user) {
    const address = ethers.utils.getAddress(user.id);
    const cachedAccount = await queryCachedAccount(address);
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
      const userVaultBalances = await Promise.all(balances.map(async (bal) => toVaultBalance(chain, bal)));
      cachedAccount.balances = cachedAccount.balances
        .filter((bal) => bal.network !== chain.network)
        .concat(userVaultBalances);

      const mapper = getDataMapper();
      await mapper.put(cachedAccount);
    }
  }
}

export async function refreshUserAccounts() {
  const chains = SUPPORTED_CHAINS.filter((c) => c.network !== Network.BinanceSmartChain);
  await Promise.all(
    chains.map(async (chain) => {
      try {
        await refreshClaimableBalances(chain);
      } catch (err) {
        console.log(`Failred to refresh claimable balances for ${chain.network}`);
        console.error(err);
      }
    }),
  );

  return 'done';
}
