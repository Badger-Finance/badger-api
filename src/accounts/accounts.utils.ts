import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { getSdk, OrderDirection, UserQuery, User_OrderBy } from '../graphql/generated/badger';
import { CachedAccount } from './interfaces/cached-account.interface';

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

export const getCachedAccount = async (address: string): Promise<CachedAccount | undefined> => {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CachedAccount,
      { address },
      { limit: 1, scanIndexForward: false },
    )) {
      return item;
    }
    return;
  } catch (err) {
    console.error(err);
    return;
  }
};
