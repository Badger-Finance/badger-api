import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getChainStartBlockKey, getDataMapper, getLeaderboardKey } from '../aws/dynamodb.utils';
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
import { formatBalance, getVaultTokens, getToken, cachedTokenBalanceToTokenBalance } from '../tokens/tokens.utils';
import { AccountMap } from './interfaces/account-map.interface';
import { CachedAccount } from './interfaces/cached-account.interface';
import { CachedSettBalance } from './interfaces/cached-sett-balance.interface';
import { Account } from '@badger-dao/sdk';
import { UserClaimSnapshot } from '../rewards/entities/user-claim-snapshot';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';

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
  const pageSize = 100;
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
    } catch (err) {
      break;
    }
  }

  console.log(`Retrieved ${accounts.size} accounts on ${chain.name}`);
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
  const accounts = await Promise.all(addresses.map(async (addr) => queryCachedAccount(addr)));
  return Object.fromEntries(accounts.map((acc) => [ethers.utils.getAddress(acc.address), acc]));
}

export async function queryCachedAccount(address: string): Promise<CachedAccount> {
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
    { leaderboard: getLeaderboardKey(chain), address: ethers.utils.getAddress(address) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddressAndLeaderboard' },
  )) {
    return entry;
  }
  return defaultBoost(chain, address);
}

export async function getCachedAccount(chain: Chain, address: string): Promise<Account> {
  const [cachedAccount, metadata] = await Promise.all([queryCachedAccount(address), getLatestMetadata(chain)]);
  const claimableBalanceSnapshot = await getClaimableBalanceSnapshot(chain, address, metadata.startBlock);
  const { network } = chain;
  const balances = cachedAccount.balances
    .filter((bal) => !network || bal.network === network)
    .map((bal) => ({
      ...bal,
      tokens: bal.tokens.map((token) => cachedTokenBalanceToTokenBalance(token)),
      earnedTokens: bal.earnedTokens.map((token) => cachedTokenBalanceToTokenBalance(token)),
    }));
  const multipliers = Object.fromEntries(
    cachedAccount.multipliers
      .filter((mult) => mult.network === network)
      .map((entry) => [entry.address, entry.multiplier]),
  );
  const data = Object.fromEntries(balances.map((bal) => [bal.address, bal]));
  const claimableBalances = Object.fromEntries(
    claimableBalanceSnapshot.claimableBalances.map((bal) => [bal.address, bal.balance]),
  );
  const cachedBoost = await getCachedBoost(chain, cachedAccount.address);
  const { boost, rank, stakeRatio, nftBalance, nativeBalance, nonNativeBalance } = cachedBoost;
  // const { address } = cachedAccount;
  const value = balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
  const earnedValue = balances.map((b) => b.earnedValue).reduce((total, value) => (total += value), 0);
  const account: Account = {
    address,
    value,
    earnedValue,
    boost,
    boostRank: rank,
    multipliers,
    data,
    claimableBalances,
    stakeRatio,
    nftBalance,
    nativeBalance,
    nonNativeBalance,
  };
  return account;
}

export async function getClaimableBalanceSnapshot(
  chain: Chain,
  address: string,
  startBlock: number,
): Promise<UserClaimSnapshot> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    UserClaimSnapshot,
    { chainStartBlock: getChainStartBlockKey(chain, startBlock), address: ethers.utils.getAddress(address) },
    { limit: 1, indexName: 'IndexUnclaimedSnapshotsOnAddressAndChainStartBlock' },
  )) {
    return entry;
  }
  return {
    chainStartBlock: getChainStartBlockKey(chain, startBlock),
    address,
    chain: chain.network,
    claimableBalances: [],
    expiresAt: Date.now(),
  };
}

export async function getLatestMetadata(chain: Chain): Promise<UserClaimMetadata> {
  const mapper = getDataMapper();
  let result: UserClaimMetadata | null = null;
  for await (const metric of mapper.query(
    UserClaimMetadata,
    { chain: chain.network },
    { indexName: 'IndexMetadataChainAndStartBlock', scanIndexForward: false, limit: 1 },
  )) {
    result = metric;
  }
  // In case there UserClaimMetadata wasn't created yet, create it with default values
  if (!result) {
    const blockNumber = await chain.provider.getBlockNumber();
    const metaData = Object.assign(new UserClaimMetadata(), {
      startBlock: blockNumber,
      endBlock: blockNumber + 1,
      chainStartBlock: getChainStartBlockKey(chain, blockNumber),
      chain: chain.network,
    });
    result = await mapper.put(metaData);
  }
  return result;
}
