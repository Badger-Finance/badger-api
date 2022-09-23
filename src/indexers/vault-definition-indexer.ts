import { RegistryVault } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { constructVaultDefinition } from './indexer.utils';

export async function captureVaultData() {
  const chains = getSupportedChains();
  for (const chain of chains) {
    const sdk = await chain.getSdk();

    if (!sdk.registry.hasRegistry()) {
      continue;
    }

    const productionVaults = await sdk.registry.getProductionVaults();
    let developmentVaults = await sdk.registry.getDevelopmentVaults();

    const productionVaultAddresses = productionVaults.map((v) => v.address);
    developmentVaults = developmentVaults.filter((v) => !productionVaultAddresses.includes(v.address));

    const allRegistryVaults = [...productionVaults, ...developmentVaults];
    if (allRegistryVaults.length === 0) {
      console.warn(`Found no vaults for ${chain.network}`);
      continue;
    }

    // update vaults from chain
    await Promise.all(
      allRegistryVaults.map(async (vault) => {
        const fullVaultData = await sdk.vaults.loadVault({ address: vault.address, update: true });
        return updateVaultDefinition(chain, fullVaultData);
      }),
    );

    const mapper = getDataMapper();
    const query = mapper.query(
      VaultDefinitionModel,
      { chain: chain.network },
      { indexName: 'IndexVaultCompoundDataChain' },
    );

    try {
      for await (const cachedVaultDefinition of query) {
        if (!productionVaultAddresses.includes(cachedVaultDefinition.address)) {
          // mark this vault as not a prod one, mb just delete it, not sure
          cachedVaultDefinition.isProduction = 0;
          await mapper.put(cachedVaultDefinition);
        }
      }
    } catch (e) {
      console.error(`Failed to update isProduction status for vaults and chain: ${chain.network}`);
    }
  }

  return 'done';
}

async function updateVaultDefinition(chain: Chain, vault: RegistryVault, isProduction = true) {
  let vaultDefinition;
  try {
    vaultDefinition = await constructVaultDefinition(chain, vault, isProduction);
    if (vaultDefinition) {
      const mapper = getDataMapper();
      await mapper.put(vaultDefinition);
    }
  } catch (err) {
    console.error({ err, vault: vault.name });
  }
}
