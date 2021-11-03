import { Account, Network } from '@badger-dao/sdk';
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { getSdk, OrderDirection, UserQuery, UserSettBalance, UsersQuery } from '../graphql/generated/badger';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { CachedBoost } from '../leaderboards/interface/cached-boost.interface';
import { getPrice, inCurrency } from '../prices/prices.utils';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { getCachedSett, getSettDefinition } from '../setts/setts.utils';
import { cachedTokenBalanceToTokenBalance, formatBalance, getSettTokens, getToken } from '../tokens/tokens.utils';
import { CachedAccount } from './interfaces/cached-account.interface';
import { CachedSettBalance } from './interfaces/cached-sett-balance.interface';

export function defaultBoost(address: string): CachedBoost {
  return {
    leaderboard: LeaderBoardType.BadgerBoost,
    rank: 0,
    address,
    boost: 1,
    stakeRatio: 0,
    nftMultiplier: 0,
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
  const boostFile = await getBoostFile(chain);
  if (!boostFile) {
    return [];
  }
  return Object.keys(boostFile.userData).map((acc) => ethers.utils.getAddress(acc));
}

export function cachedAccountToAccount(cachedAccount: CachedAccount, network?: Network): Account {
  const balances = cachedAccount.balances
    .filter((bal) => !network || bal.network === network)
    .map((bal) => ({
      ...bal,
      tokens: bal.tokens.map((token) => cachedTokenBalanceToTokenBalance(token)),
      earnedTokens: bal.earnedTokens.map((token) => cachedTokenBalanceToTokenBalance(token)),
    }));
  const multipliers = Object.fromEntries(cachedAccount.multipliers.map((entry) => [entry.address, entry.multiplier]));
  const data = Object.fromEntries(balances.map((bal) => [bal.address, bal]));
  const claimableBalances = Object.fromEntries(
    cachedAccount.claimableBalances.map((bal) => [bal.address, bal.balance]),
  );
  const { address, value, earnedValue, boost, boostRank, stakeRatio, nativeBalance, nonNativeBalance } = cachedAccount;
  const account: Account = {
    address,
    value,
    earnedValue,
    boost,
    boostRank,
    multipliers,
    data,
    claimableBalances,
    stakeRatio,
    nativeBalance,
    nonNativeBalance,
  };
  delete account.multipliers[TOKENS.BICVX];
  return account;
}

export async function getCachedAccount(address: string): Promise<CachedAccount> {
  const checksummedAccount = ethers.utils.getAddress(address);
  const defaultAccount: CachedAccount = {
    address: checksummedAccount,
    boost: 0,
    boostRank: 0,
    multipliers: [],
    value: 0,
    earnedValue: 0,
    balances: [],
    claimableBalances: [],
    stakeRatio: 1,
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
      return {
        ...defaultAccount,
        ...item,
      };
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
  const settDefinition = getSettDefinition(chain, settBalance.sett.id);
  const { netShareDeposit, grossDeposit, grossWithdraw } = settBalance;
  const { pricePerFullShare } = await getCachedSett(settDefinition);

  const depositToken = getToken(settDefinition.depositToken);
  const settToken = getToken(settDefinition.settToken);
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
    getPrice(settDefinition.depositToken),
    getSettTokens(settDefinition, earnedBalance, currency),
    getSettTokens(settDefinition, balanceTokens, currency),
  ]);

  return Object.assign(new CachedSettBalance(), {
    network: chain.network,
    address: settDefinition.settToken,
    name: settDefinition.name,
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
    { address: ethers.utils.getAddress(address) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddress' },
  )) {
    return entry;
  }
  return defaultBoost(address);
}
