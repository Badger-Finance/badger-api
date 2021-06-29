import { UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/constants';
import { getSdk, OrderDirection, User_OrderBy, UserQuery, UserSettBalance } from '../graphql/generated/badger';
import { getPrice, inCurrency } from '../prices/prices.utils';
import { getSettDefinition } from '../setts/setts.utils';
import { TokenRequest } from '../tokens/interfaces/token-request.interface';
import { getSettTokens, getToken } from '../tokens/tokens.utils';
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
    console.error(err);
    return;
  }
}

export async function toSettBalance(
  chain: Chain,
  settBalance: UserSettBalance,
  currency?: string,
): Promise<SettBalance> {
  const sett = settBalance.sett;
  const settDefinition = getSettDefinition(chain, settBalance.sett.id);

  // settDefinition should not be undefined - if so there is a config issue
  if (!settDefinition) {
    throw new UnprocessableEntity('Unable to fetch user account');
  }
  const settToken = getToken(settDefinition.settToken);

  let ratio = 1;
  let settPricePerFullShare = parseInt(sett.pricePerFullShare) / 1e18;
  if (settDefinition.settToken === TOKENS.DIGG) {
    ratio = sett.balance / sett.totalSupply / settPricePerFullShare;
    settPricePerFullShare = sett.balance / sett.totalSupply;
  }
  const netShareDeposit = parseInt(settBalance.netShareDeposit);
  const grossDeposit = parseInt(settBalance.grossDeposit) * ratio;
  const grossWithdraw = parseInt(settBalance.grossWithdraw) * ratio;
  const settTokens = settPricePerFullShare * netShareDeposit;
  const earnedBalance = (settTokens - grossDeposit + grossWithdraw) / Math.pow(10, sett.token.decimals);
  const balance = settTokens / Math.pow(10, sett.token.decimals);

  const earnedTokenRequest: TokenRequest = {
    chain: chain,
    sett: settDefinition,
    balance: earnedBalance,
  };
  const balanceTokenRequest: TokenRequest = {
    chain: chain,
    sett: settDefinition,
    balance: balance,
  };
  const [settTokenPrice, earnedTokens, tokens] = await Promise.all([
    getPrice(sett.token.id),
    getSettTokens(earnedTokenRequest),
    getSettTokens(balanceTokenRequest),
  ]);
  return {
    id: settDefinition.settToken,
    name: settDefinition.name,
    asset: settToken.symbol,
    balance,
    value: inCurrency(settTokenPrice, currency) * balance,
    tokens,
    earnedBalance,
    earnedValue: inCurrency(settTokenPrice, currency) * earnedBalance,
    earnedTokens,
  };
}
