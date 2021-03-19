import { GraphQLClient } from 'graphql-request';
import { getSdk, SettQuery, SettQueryVariables } from '../graphql/generated/badger';

export const getSett = async (graphUrl: string, contract: string, block?: number): Promise<SettQuery> => {
  const badgerGraphqlClient = new GraphQLClient(graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  let vars: SettQueryVariables = {
    id: contract.toLowerCase(),
  };
  if (block) {
    vars = {
      ...vars,
      block: {
        number: block,
      },
    };
  }
  return badgerGraphqlSdk.Sett(vars);
};
