import { BigNumber, ethers } from 'ethers';
import { getAccounts, getCachedAccount, getUserAccounts, toSettBalance } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { CachedBalance } from '../accounts/interfaces/cached-claimable-balance.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { BadgerTree__factory } from '../contracts';
import { UserSettBalance } from '../graphql/generated/badger';
import { RewardMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';
import { RewardAmounts } from '../rewards/interfaces/reward-amounts.interface';
import { getTreeDistribution } from '../rewards/rewards.utils';
import { getSettDefinition } from '../setts/setts.utils';

export enum IndexMode {
  ClaimableBalanceData = 'ClaimableBalanceData',
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

async function refreshAccountClaimableBalances(chain: Chain, batchAccounts: AccountMap) {
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

export async function refreshAccounts(chain: Chain, mode: IndexMode, accounts: string[]) {
  let refreshFns: Promise<void>[] = [];
  switch (mode) {
    case IndexMode.ClaimableBalanceData:
      refreshFns = [
        batchRefreshAccounts(accounts, (batchAccounts) => [refreshAccountClaimableBalances(chain, batchAccounts)]),
      ];
      break;
    case IndexMode.BalanceData:
    default:
      refreshFns = chunkArray(accounts, 10).flatMap((chunk) =>
        batchRefreshAccounts(chunk, (batchAccounts) => [refreshAccountSettBalances(chain, batchAccounts)], 100),
      );
      break;
  }
  await Promise.all(refreshFns);
}

/**
 * Top level refresh call to separate chain updates.
 */
export async function refreshUserAccounts(event: AccountIndexEvent) {
  const { mode } = event;
  console.log(`refreshUserAccounts mode: ${mode}`);
  console.time(`refreshUserAccounts mode: ${mode}`);
  const chains = loadChains();
  const allAccounts = await Promise.all(chains.map((chain) => getAccounts(chain)));
  const accounts = [...new Set(...allAccounts)];
  await Promise.all(chains.map((chain) => refreshAccounts(chain, mode, accounts)));
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
