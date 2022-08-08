import { Service } from '@tsed/di';

import { VAULT_DEFINITION_SEED_NAME } from './dev.constants';
import { getVaultsDefinitionSeedData, saveSeedJSONFile } from './dev.utils';

@Service()
export class DevelopmentService {
  async updateDynamoDbSeeds() {
    const vaultsDefinitions = await getVaultsDefinitionSeedData();

    saveSeedJSONFile(vaultsDefinitions, VAULT_DEFINITION_SEED_NAME);

    return { status: 'success' };
  }
}
