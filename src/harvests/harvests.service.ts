import { Service } from '@tsed/common';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../chains/config/chain.config';
import { getSdk, HarvestsQuery, HarvestsQueryVariables } from '../graphql/generated/badger';

@Service()
export class HarvestsService {
  async listHarvests(chain: Chain, options: HarvestsQueryVariables): Promise<HarvestsQuery> {
    const badgerDaoGraphqlClient = new GraphQLClient(chain.graphUrl);
    const badgerDaoGraphqlSdk = getSdk(badgerDaoGraphqlClient);
    return badgerDaoGraphqlSdk.Harvests(options);
  }
}
