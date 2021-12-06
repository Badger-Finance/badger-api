import { BigNumber, ethers } from 'ethers';
import { getAccounts, getUserAccounts, toSettBalance } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { CachedBalance } from '../accounts/interfaces/cached-claimable-balance.interface';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { BadgerTree__factory } from '../contracts';
import { UserSettBalance } from '../graphql/generated/badger';
import { RewardMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';
import { RewardAmounts } from '../rewards/interfaces/reward-amounts.interface';
import { getTreeDistribution } from '../rewards/rewards.utils';
import { getSettDefinition } from '../setts/setts.utils';
import { AccountIndexMode } from './enums/account-index-mode.enum';
import { batchRefreshAccounts, chunkArray } from './indexer.utils';
import { AccountIndexEvent } from './interfaces/account-index-event.interface';

const distributionCache: Record<string, RewardMerkleDistribution | null> = {};

export async function refreshAccountClaimableBalances(chain: Chain, batchAccounts: AccountMap) {
  const addresses = Object.keys(batchAccounts);
  const calls: { user: string; chain: Chain; claim: Promise<[string[], BigNumber[]]> }[] = [];

  if (chain.badgerTree && distributionCache[chain.network] === undefined) {
    distributionCache[chain.network] = await getTreeDistribution(chain);
  }

  await Promise.all(
    addresses.map(async (acc) => {
      try {
        const treeDistribution = distributionCache[chain.network];
        if (!treeDistribution) {
          return;
        }
        const claim = treeDistribution.claims[acc];
        if (!claim || !chain.badgerTree) {
          return;
        }
        const badgerTree = BadgerTree__factory.connect(chain.badgerTree, chain.batchProvider);
        calls.push({
          user: acc,
          chain,
          claim: badgerTree.getClaimableFor(acc, claim.tokens, claim.cumulativeAmounts),
        });
      } catch {} // ignore errors, tree distribution does not exist
    }),
  );
  const userClaims = await Promise.all(calls.map((call) => call.claim));
  userClaims.forEach((claim, i) => {
    const { chain, user } = calls[i];
    if (!user) {
      return;
    }
    const account = batchAccounts[user];
    const [tokens, amounts] = claim;
    const rewardAmounts: RewardAmounts = { tokens, amounts };
    const claimableBalances = rewardAmounts.tokens.map((token, i) => {
      const balance = rewardAmounts.amounts[i];
      return Object.assign(new CachedBalance(), {
        network: chain.network,
        address: token,
        balance: balance.toString(),
      });
    });
    account.claimableBalances = account.claimableBalances
      .filter((bal) => bal.network !== chain.network)
      .concat(claimableBalances);
    batchAccounts[user] = account;
  });
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
            getSettDefinition(chain, balance.sett.id);
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
  await Promise.all(chains.map(async (chain) => {
    const accounts = await getAccounts(chain);
    let refreshFns: Promise<void>[] = [];
    switch (mode) {
      case AccountIndexMode.ClaimableBalanceData:
        refreshFns = [
          batchRefreshAccounts(accounts, (batchAccounts) => [
            refreshAccountClaimableBalances(chain, batchAccounts),
          ]),
        ];
        break;
      case AccountIndexMode.BalanceData:
      default:
        refreshFns = chunkArray(accounts, 10).flatMap((chunk) =>
          batchRefreshAccounts(
            chunk,
            (batchAccounts) => [refreshAccountSettBalances(chain, batchAccounts)],
            100,
          ),
        );
        break;
    }
    await Promise.all(refreshFns);
  }));
}
