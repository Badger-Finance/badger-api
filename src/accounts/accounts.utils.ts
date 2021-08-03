import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { getSdk, OrderDirection, User_OrderBy, UserQuery, UserSettBalance } from '../graphql/generated/badger';
import { getPrice, inCurrency } from '../prices/prices.utils';
import { getCachedSett, getSettDefinition } from '../setts/setts.utils';
import { formatBalance, getSettTokens, getToken } from '../tokens/tokens.utils';
import { CachedAccount } from './interfaces/cached-account.interface';
import { SettBalance } from './interfaces/sett-balance.interface';

export async function getUserAccount(chain: Chain, accountId: string): Promise<UserQuery> {
  const badgerGraphqlClient = new GraphQLClient(chain.graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  return badgerGraphqlSdk.User({
    id: accountId.toLowerCase(),
    orderDirection: OrderDirection.Asc,
  });
}

export async function getAccounts(chain: Chain): Promise<string[]> {
  const badgerGraphqlClient = new GraphQLClient(chain.graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);

  const accounts: string[] = [];

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
      if (!userPage || !userPage.users) {
        break;
      }
      const { users } = userPage;
      lastAddress = users[users.length - 1].id;
      users.forEach((user) => accounts.push(ethers.utils.getAddress(user.id)));
    } catch (err) {
      break;
    }
  }

  return accounts;
}

export async function getCachedAccount(address: string): Promise<CachedAccount | undefined> {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(CachedAccount, { address }, { limit: 1, scanIndexForward: false })) {
      return item;
    }
    return;
  } catch (err) {
    return;
  }
}

export async function toSettBalance(
  chain: Chain,
  settBalance: UserSettBalance,
  currency?: string,
): Promise<SettBalance> {
  const settDefinition = getSettDefinition(chain, settBalance.sett.id);
  const { netShareDeposit, grossDeposit, grossWithdraw } = settBalance;
  const { ppfs } = await getCachedSett(settDefinition);

  const depositToken = getToken(settDefinition.depositToken);
  const settToken = getToken(settDefinition.settToken);
  const currentTokens = formatBalance(netShareDeposit, settToken.decimals);
  let depositTokenDecimals = depositToken.decimals;
  if (depositToken.address === TOKENS.DIGG) {
    depositTokenDecimals = settToken.decimals;
  }
  const depositedTokens = formatBalance(grossDeposit, depositTokenDecimals);
  const withdrawnTokens = formatBalance(grossWithdraw, depositTokenDecimals);
  const balanceTokens = currentTokens * ppfs;
  const earnedBalance = balanceTokens - depositedTokens + withdrawnTokens;
  const [depositTokenPrice, earnedTokens, tokens] = await Promise.all([
    getPrice(settDefinition.depositToken),
    getSettTokens(settDefinition, earnedBalance, currency),
    getSettTokens(settDefinition, balanceTokens, currency),
  ]);

  return {
    id: settDefinition.settToken,
    name: settDefinition.name,
    asset: depositToken.symbol,
    ppfs,
    balance: balanceTokens,
    value: inCurrency(depositTokenPrice, currency) * balanceTokens,
    tokens,
    earnedBalance: earnedBalance,
    earnedValue: inCurrency(depositTokenPrice, currency) * earnedBalance,
    earnedTokens,
    depositedBalance: depositedTokens,
    withdrawnBalance: withdrawnTokens,
  };
}
