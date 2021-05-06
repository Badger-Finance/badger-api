import { GraphQLClient } from 'graphql-request';
import { Chain } from '../chains/config/chain.config';
import { getSdk, OrderDirection, UserQuery } from '../graphql/generated/badger';

export const getUserAccount = async (chain: Chain, accountId: string): Promise<UserQuery> => {
  const badgerGraphqlClient = new GraphQLClient(chain.graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  return badgerGraphqlSdk.User({
    id: accountId.toLowerCase(),
    orderDirection: OrderDirection.Asc,
  });
};
