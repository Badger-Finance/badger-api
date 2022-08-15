/************************************************************************/
/*                       Seed utils section start                       */
/************************************************************************/
import { RegistryVault } from '@badger-dao/sdk';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { constructVaultDefinition } from '../indexers/indexer.utils';
import { VAULT_SEED_DIR } from './dev.constants';

export async function getVaultsDefinitionSeedData(): Promise<VaultDefinitionModel[]> {
  const seedVaults: VaultDefinitionModel[] = [];

  for (const chain of SUPPORTED_CHAINS) {
    const sdk = await chain.getSdk();
    let registryVaults: RegistryVault[] = [];

    try {
      registryVaults = await sdk.vaults.loadVaults();
    } catch (e) {
      console.error(`Problems with getting vaults for chain ${chain.network}. ${e}`);
    }

    if (registryVaults.length === 0) {
      console.error(`No vaults found for chain: ${chain.network}`);
      continue;
    }

    await Promise.all(
      registryVaults.map(async (vault) => {
        let compoundVault;
        try {
          compoundVault = await constructVaultDefinition(chain, vault);
          if (compoundVault) seedVaults.push(compoundVault);
        } catch (err) {
          console.error({ err, vault: vault.name });
        }
      })
    );
  }

  return seedVaults;
}

export function saveSeedJSONFile<T>(data: T, filename: string) {
  writeFileSync(resolve(__dirname, '../../../', VAULT_SEED_DIR, filename), JSON.stringify(data, null, 2));
}

/************************************************************************/
/*                       Seed utils section end                       */
/************************************************************************/
