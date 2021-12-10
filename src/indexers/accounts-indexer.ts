import { ethers } from 'ethers';
import { getAccounts, getUserAccounts, toSettBalance } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { UserSettBalance } from '../graphql/generated/badger';
import { ClaimableBalance } from '../rewards/entities/claimable-balance';
import { UserClaimSnapshot } from '../rewards/entities/user-claim-snapshot';
import { getClaimableRewards, getTreeDistribution } from '../rewards/rewards.utils';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { AccountIndexMode } from './enums/account-index-mode.enum';
import { batchRefreshAccounts, chunkArray } from './indexer.utils';
import { AccountIndexEvent } from './interfaces/account-index-event.interface';

export async function refreshClaimableBalances(chain: Chain) {
  const distribution = await getTreeDistribution(chain);
  if (!distribution || !chain.badgerTree) {
    return;
  }
  const chainUsers = await getAccounts(chain);

  const results = await getClaimableRewards(chain, chainUsers, distribution);
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
      // TODO: integrate with claimable balance metadata table for lookup
      chainStartBlock: 0,
      address: user,
      network: chain.network,
      claimableBalances,
    });
  });

  const mapper = getDataMapper();
  for await (const _item of mapper.batchPut(userClaimSnapshots)) {
  }
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

/**
 * Top level refresh call to separate chain updates.
 */
export async function refreshUserAccounts(event: AccountIndexEvent) {
  const { mode } = event;
  const chains = loadChains();
  await Promise.all(
    chains.map(async (chain) => {
      const accounts = await getAccounts(chain);
      let refreshFns: Promise<void>[] = [];
      switch (mode) {
        case AccountIndexMode.BalanceData:
        default:
          refreshFns = chunkArray(accounts, 10).flatMap((chunk) =>
            batchRefreshAccounts(chunk, (batchAccounts) => [refreshAccountSettBalances(chain, batchAccounts)], 100),
          );
          break;
      }
      await Promise.all(refreshFns);
    }),
  );
}
