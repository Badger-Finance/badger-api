import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import {
  getSdk,
  OrderDirection,
  UserQuery,
  UserSettBalance,
  UsersQuery,
  User_OrderBy,
} from '../graphql/generated/badger';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { CachedBoost } from '../leaderboards/interface/cached-boost.interface';
import { getPrice, inCurrency } from '../prices/prices.utils';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { getCachedVault, getVaultDefinition } from '../vaults/vaults.utils';
import { formatBalance, getVaultTokens, getToken } from '../tokens/tokens.utils';
import { AccountMap } from './interfaces/account-map.interface';
import { CachedAccount } from './interfaces/cached-account.interface';
import { CachedSettBalance } from './interfaces/cached-sett-balance.interface';

export function defaultBoost(chain: Chain, address: string): CachedBoost {
  return {
    leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`,
    rank: 0,
    address,
    boost: 1,
    stakeRatio: 0,
    nftBalance: 0,
    nativeBalance: 0,
    nonNativeBalance: 0,
  };
}

export async function getUserAccount(chain: Chain, accountId: string): Promise<UserQuery> {
  const badgerGraphqlClient = new GraphQLClient(chain.graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  return badgerGraphqlSdk.User({
    id: accountId.toLowerCase(),
    orderDirection: OrderDirection.Asc,
  });
}

export async function getUserAccounts(chain: Chain, accounts: string[]): Promise<UsersQuery> {
  const badgerGraphqlClient = new GraphQLClient(chain.graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  return badgerGraphqlSdk.Users({
    where: {
      id_in: accounts.map((acc) => acc.toLowerCase()),
    },
  });
}

export async function getBoostFile(chain: Chain): Promise<BoostData | null> {
  if (!chain.rewardsLogger || !chain.badgerTree) {
    return null;
  }
  const boostFile = await getObject(REWARD_DATA, `badger-boosts-${parseInt(chain.chainId, 16)}.json`);
  return JSON.parse(boostFile.toString('utf-8'));
}

export async function getAccounts(chain: Chain): Promise<string[]> {
  const badgerGraphqlClient = new GraphQLClient(chain.graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);

  const accounts = new Set<string>();

  let lastAddress: string | undefined;
  const pageSize = 1000;
  while (true) {
    try {
      const userPage = await badgerGraphqlSdk.Users({
        first: pageSize,
        where: { id_gt: lastAddress },
        orderBy: User_OrderBy.Id,
        orderDirection: OrderDirection.Asc,
      });
      if (!userPage || !userPage.users || userPage.users.length === 0) {
        break;
      }
      const { users } = userPage;
      lastAddress = users[users.length - 1].id;
      users.forEach((user) => {
        const address = ethers.utils.getAddress(user.id);
        if (!accounts.has(address)) {
          accounts.add(address);
        }
      });
      console.log(`Found ${accounts.size} accounts on ${chain.name}`);
    } catch (err) {
      break;
    }
  }

  return [...accounts];
}

export async function getAccountsFomBoostFile(chain: Chain): Promise<string[]> {
  const boostFile = await getBoostFile(chain);
  if (!boostFile) {
    return [];
  }
  return Object.keys(boostFile.userData).map((acc) => ethers.utils.getAddress(acc));
}

export async function getAccountMap(addresses: string[]): Promise<AccountMap> {
  const accounts = await Promise.all(addresses.map(async (addr) => getCachedAccount(addr)));
  return Object.fromEntries(accounts.map((acc) => [ethers.utils.getAddress(acc.address), acc]));
}

export async function getCachedAccount(address: string): Promise<CachedAccount> {
  const checksummedAccount = ethers.utils.getAddress(address);
  const defaultAccount: CachedAccount = {
    address: checksummedAccount,
    boost: 0,
    boostRank: 0,
    nftBalance: 0,
    multipliers: [],
    value: 0,
    earnedValue: 0,
    balances: [],
    claimableBalances: [],
    stakeRatio: 0,
    nativeBalance: 0,
    nonNativeBalance: 0,
  };
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CachedAccount,
      { address: checksummedAccount },
      { limit: 1, scanIndexForward: false },
    )) {
      return item;
    }
    return defaultAccount;
  } catch (err) {
    return defaultAccount;
  }
}

export async function toSettBalance(
  chain: Chain,
  settBalance: UserSettBalance,
  currency?: string,
): Promise<CachedSettBalance> {
  const vaultDefinition = getVaultDefinition(chain, settBalance.sett.id);
  const { netShareDeposit, grossDeposit, grossWithdraw } = settBalance;
  const { pricePerFullShare } = await getCachedVault(vaultDefinition);

  const depositToken = getToken(vaultDefinition.depositToken);
  const settToken = getToken(vaultDefinition.vaultToken);
  const currentTokens = formatBalance(netShareDeposit, settToken.decimals);
  let depositTokenDecimals = depositToken.decimals;
  if (depositToken.address === TOKENS.DIGG) {
    depositTokenDecimals = settToken.decimals;
  }
  const depositedTokens = formatBalance(grossDeposit, depositTokenDecimals);
  const withdrawnTokens = formatBalance(grossWithdraw, depositTokenDecimals);
  const balanceTokens = currentTokens * pricePerFullShare;
  const earnedBalance = balanceTokens - depositedTokens + withdrawnTokens;
  const [depositTokenPrice, earnedTokens, tokens] = await Promise.all([
    getPrice(vaultDefinition.depositToken),
    getVaultTokens(vaultDefinition, earnedBalance, currency),
    getVaultTokens(vaultDefinition, balanceTokens, currency),
  ]);

  return Object.assign(new CachedSettBalance(), {
    network: chain.network,
    address: vaultDefinition.vaultToken,
    name: vaultDefinition.name,
    symbol: depositToken.symbol,
    pricePerFullShare: pricePerFullShare,
    balance: balanceTokens,
    value: inCurrency(depositTokenPrice, currency) * balanceTokens,
    tokens,
    earnedBalance: earnedBalance,
    earnedValue: inCurrency(depositTokenPrice, currency) * earnedBalance,
    earnedTokens,
    depositedBalance: depositedTokens,
    withdrawnBalance: withdrawnTokens,
  });
}

export async function getCachedBoost(chain: Chain, address: string): Promise<CachedBoost> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    { leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`, address: ethers.utils.getAddress(address) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddressAndLeaderboard' },
  )) {
    return entry;
  }
  return defaultBoost(chain, address);
}
