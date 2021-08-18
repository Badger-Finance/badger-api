import { BigNumber, ethers } from 'ethers';
import { getAccounts, getCachedAccount, getUserAccounts, toSettBalance } from '../accounts/accounts.utils';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { CachedBalance } from '../accounts/interfaces/cached-claimable-balance.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { BadgerTree__factory } from '../contracts';
import { UserSettBalance } from '../graphql/generated/badger';
import { getUserLeaderBoardRank } from '../leaderboards/leaderboards.utils';
import { CachedBoostMultiplier } from '../rewards/interfaces/cached-boost-multiplier.interface';
import { RewardAmounts } from '../rewards/interfaces/reward-amounts.interface';
import { RewardsService } from '../rewards/rewards.service';
import { getTreeDistribution } from '../rewards/rewards.utils';
import { getSettDefinition } from '../setts/setts.utils';

export async function refreshClaimableBalances(): Promise<void> {
  const chains = loadChains();
  const allAccounts = await Promise.all(chains.map((chain) => getAccounts(chain)));
  const accounts = [...new Set(...allAccounts)];
  const treeDistribution = await getTreeDistribution();
  const accountData: CachedAccount[] = [];

  const batchSize = 500;
  for (let i = 0; i < accounts.length; i += batchSize) {
    const addresses = accounts.slice(i, i + batchSize);
    const batchAccounts: Record<string, CachedAccount> = {};
    await Promise.all(
      addresses.map(async (addr) => {
        let cachedAccount = await getCachedAccount(addr);
        if (!cachedAccount) {
          cachedAccount = {
            address: addr,
            boost: 0,
            boostRank: 0,
            multipliers: [],
            value: 0,
            earnedValue: 0,
            balances: [],
            claimableBalances: [],
            nativeBalance: 0,
            nonNativeBalance: 0,
          };
        }
        batchAccounts[addr] = cachedAccount;
      }),
    );

    const calls: { user: string; chain: Chain; claim: Promise<[string[], BigNumber[]]> }[] = [];
    await Promise.all(
      addresses.map(async (acc) => {
        await Promise.all(
          chains.map(async (chain) => {
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
          }),
        );
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

    Object.values(batchAccounts).forEach((account) => accountData.push(Object.assign(new CachedAccount(), account)));
  }

  const mapper = getDataMapper();
  for await (const _item of mapper.batchPut(accountData)) {
  }
}

export async function refreshSettBalances(): Promise<void> {
  const chains = loadChains();
  const allAccounts = await Promise.all(chains.map((chain) => getAccounts(chain)));
  const accounts = [...new Set(...allAccounts)];
  const accountData: CachedAccount[] = [];

  const batchSize = 500;
  for (let i = 0; i < accounts.length; i += batchSize) {
    const addresses = accounts.slice(i, i + batchSize);
    const batchAccounts: Record<string, CachedAccount> = {};
    await Promise.all(
      addresses.map(async (addr) => {
        let cachedAccount = await getCachedAccount(addr);
        if (!cachedAccount) {
          cachedAccount = {
            address: addr,
            boost: 0,
            boostRank: 0,
            multipliers: [],
            value: 0,
            earnedValue: 0,
            balances: [],
            claimableBalances: [],
            nativeBalance: 0,
            nonNativeBalance: 0,
          };
        }
        batchAccounts[addr] = cachedAccount;
      }),
    );

    await Promise.all(
      chains.map(async (chain) => {
        const response = await getUserAccounts(chain, addresses);
        for (const user of response.users) {
          const address = ethers.utils.getAddress(user.id);
          const account = batchAccounts[address];
          if (user) {
            const userBalances = user.settBalances as UserSettBalance[];
            if (userBalances) {
              const protocolSettBalances = userBalances.filter((balance) => {
                try {
                  getSettDefinition(chain, balance.sett.id);
                  return true;
                } catch (err) {
                  return false;
                }
              });
              const settBalances = await Promise.all(
                protocolSettBalances.map(async (settBalance) => toSettBalance(chain, settBalance)),
              );
              account.balances = account.balances.concat(settBalances);
            }
          }
          account.value = account.balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
          account.earnedValue = account.balances
            .map((b) => b.earnedValue)
            .reduce((total, value) => (total += value), 0);
          batchAccounts[address] = account;
        }
      }),
    );

    Object.values(batchAccounts).forEach((account) => accountData.push(Object.assign(new CachedAccount(), account)));
  }

  const mapper = getDataMapper();
  for await (const _item of mapper.batchPut(accountData)) {
  }
}

export async function refreshBoostInfo() {
  const chains = loadChains();
  const allAccounts = await Promise.all(chains.map((chain) => getAccounts(chain)));
  const accounts = [...new Set(...allAccounts)];
  const accountData: CachedAccount[] = [];

  const batchSize = 500;
  for (let i = 0; i < 500; i += batchSize) {
    const addresses = accounts.slice(i, i + batchSize);

    const batchAccounts: Record<string, CachedAccount> = {};
    await Promise.all(
      addresses.map(async (addr) => {
        let cachedAccount = await getCachedAccount(addr);
        if (!cachedAccount) {
          cachedAccount = {
            address: addr,
            boost: 0,
            boostRank: 0,
            multipliers: [],
            value: 0,
            earnedValue: 0,
            balances: [],
            claimableBalances: [],
            nativeBalance: 0,
            nonNativeBalance: 0,
          };
        }
        batchAccounts[addr] = cachedAccount;
      }),
    );

    console.time(`Round ${i / batchSize} Boost + Leaderboard Calls`);
    await Promise.all(
      addresses.map(async (acc) => {
        const account = batchAccounts[acc];
        const [boostData, boostRank] = await Promise.all([
          RewardsService.getUserBoost(acc),
          getUserLeaderBoardRank(acc),
        ]);
        const { nativeBalance, nonNativeBalance, boost } = boostData;
        account.nativeBalance = nativeBalance;
        account.nonNativeBalance = nonNativeBalance;
        account.boost = boost;
        account.boostRank = boostRank;
        account.multipliers = Object.entries(boostData.multipliers).map((e) => {
          const [key, value] = e;
          return Object.assign(new CachedBoostMultiplier(), {
            address: key,
            multiplier: isNaN(value) ? 0 : value,
          });
        });
        accountData.push(Object.assign(new CachedAccount(), account));
      }),
    );

    const mapper = getDataMapper();
    for await (const _item of mapper.batchPut(accountData)) {
    }
  }
}
