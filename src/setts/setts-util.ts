import { GraphQLClient } from 'graphql-request';
import { BADGER_URL } from '../config/constants';
import { getSdk, SettQuery, SettQueryVariables } from '../graphql/generated/badger';

const badgerGraphqlClient = new GraphQLClient(BADGER_URL);
const badgerGraphqlSdk = getSdk(badgerGraphqlClient);

export const getSett = async (contract: string, block?: number): Promise<SettQuery> => {
  let vars: SettQueryVariables = {
    id: contract,
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
