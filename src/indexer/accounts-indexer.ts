import { BigNumber, ethers } from 'ethers';
import {
  getAccounts,
  getCachedAccount,
  getCachedBoost,
  getUserAccounts,
  toSettBalance,
} from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { CachedBalance } from '../accounts/interfaces/cached-claimable-balance.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { BadgerTree__factory } from '../contracts';
import { UserSettBalance } from '../graphql/generated/badger';
import { getLeaderBoardSize } from '../leaderboards/leaderboards.utils';
import { CachedBoostMultiplier } from '../rewards/interfaces/cached-boost-multiplier.interface';
import { RewardMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';
import { RewardAmounts } from '../rewards/interfaces/reward-amounts.interface';
import { RewardsService } from '../rewards/rewards.service';
import { getTreeDistribution } from '../rewards/rewards.utils';
import { getSettDefinition } from '../setts/setts.utils';

export enum IndexMode {
  ClaimableBalanceData = 'ClaimableBalanceData',
  BoostData = 'BoostData',
  BalanceData = 'BalanceData',
}

interface AccountIndexEvent {
  mode: IndexMode;
}

const distributionCache: Record<string, RewardMerkleDistribution | null> = {};

async function getAccountMap(addresses: string[]): Promise<AccountMap> {
  const accounts = await Promise.all(addresses.map(async (addr) => getCachedAccount(addr)));
  return Object.fromEntries(accounts.map((acc) => [ethers.utils.getAddress(acc.address), acc]));
}

async function refreshAccountClaimableBalances(chains: Chain[], batchAccounts: AccountMap) {
  const addresses = Object.keys(batchAccounts);
  const calls: { user: string; chain: Chain; claim: Promise<[string[], BigNumber[]]> }[] = [];

  for (const chain of chains) {
    if (chain.badgerTree && distributionCache[chain.network] === undefined) {
      distributionCache[chain.network] = await getTreeDistribution(chain);
    }
  }

  await Promise.all(
    addresses.map(async (acc) => {
      await Promise.all(
        chains.map(async (chain) => {
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
    }),
  );
  console.log(`Resolve ${calls.length} requests`);
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

export async function refreshAccountSettBalances(chains: Chain[], batchAccounts: AccountMap) {
  const addresses = Object.keys(batchAccounts);
  await Promise.all(
    chains.map(async (chain) => {
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
        account.value = account.balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
        account.earnedValue = account.balances.map((b) => b.earnedValue).reduce((total, value) => (total += value), 0);
        batchAccounts[address] = account;
      }
    }),
  );
}

async function refreshAccountBoostInfo(_chains: Chain[], batchAccounts: AccountMap) {
  const addresses = Object.keys(batchAccounts);
  const [userBoosts, maxRank] = await Promise.all([RewardsService.getUserBoosts(addresses), getLeaderBoardSize()]);

  await Promise.all(
    addresses.map(async (acc) => {
      const userBoost = userBoosts[acc];
      const account = batchAccounts[acc];
      const cachedBoost = await getCachedBoost(acc);
      account.nativeBalance = cachedBoost.nativeBalance;
      account.nonNativeBalance = cachedBoost.nonNativeBalance;
      account.boost = cachedBoost.boost;
      account.boostRank = cachedBoost.rank ?? maxRank + 1;
      account.multipliers = Object.entries(userBoost.multipliers).map((e) => {
        const [key, value] = e;
        return Object.assign(new CachedBoostMultiplier(), {
          address: key,
          multiplier: isNaN(value) ? 0 : value,
        });
      });
      batchAccounts[acc] = account;
    }),
  );
}

async function batchRefreshAccounts(
  accounts: string[],
  refreshFns: (batchAccounts: AccountMap) => Promise<void>[],
  customBatch?: number,
): Promise<void> {
  const batchSize = customBatch ?? 500;
  const mapper = getDataMapper();
  for (let i = 0; i < accounts.length; i += batchSize) {
    const addresses = accounts.slice(i, i + batchSize);
    const batchAccounts = await getAccountMap(addresses);
    await Promise.all(refreshFns(batchAccounts));
    const cachedAccounts = Object.values(batchAccounts).map((account) => Object.assign(new CachedAccount(), account));
    for await (const _item of mapper.batchPut(cachedAccounts)) {
    }
  }
}

export async function refreshAccounts(chains: Chain[], mode: IndexMode, accounts: string[]) {
  const checksummedAccounts = accounts.map((acc) => ethers.utils.getAddress(acc));
  let refreshFns: Promise<void>[] = [];
  switch (mode) {
    case IndexMode.BoostData:
      refreshFns = [
        batchRefreshAccounts(checksummedAccounts, (batchAccounts) => [refreshAccountBoostInfo(chains, batchAccounts)]),
      ];
      break;
    case IndexMode.ClaimableBalanceData:
      refreshFns = [
        batchRefreshAccounts(checksummedAccounts, (batchAccounts) => [
          refreshAccountClaimableBalances(chains, batchAccounts),
        ]),
      ];
      break;
    case IndexMode.BalanceData:
    default:
      refreshFns = chunkArray(checksummedAccounts, 10).flatMap((chunk) =>
        batchRefreshAccounts(chunk, (batchAccounts) => [refreshAccountSettBalances(chains, batchAccounts)], 100),
      );
      break;
  }
  await Promise.all(refreshFns);
}

export async function refreshUserAccounts(event: AccountIndexEvent) {
  const { mode } = event;
  console.log(`refreshUserAccounts mode: ${mode}`);
  console.time(`refreshUserAccounts mode: ${mode}`);
  const chains = loadChains();
  const allAccounts = await Promise.all(chains.map((chain) => getAccounts(chain)));
  const accounts = [...new Set(...allAccounts)];
  await refreshAccounts(chains, mode, accounts);
  console.timeEnd(`refreshUserAccounts mode: ${mode}`);
}

function chunkArray(addresses: string[], count: number): string[][] {
  const chunks: string[][] = [];
  const chunkSize = addresses.length / count;
  for (let i = 0; i < addresses.length; i += chunkSize) {
    chunks.push(addresses.slice(i, i + chunkSize));
  }
  return chunks;
}
