import { RegistryVault } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { constructVaultDefinition } from './indexer.utils';

export async function captureVaultData() {
  const chains = getSupportedChains();
  for (const chain of chains) {
    const sdk = await chain.getSdk();

    const productionVaults = await sdk.registry.getProductionVaults();
    const developmentVaults = await sdk.registry.getDevelopmentVaults();

    if (productionVaults.length === 0) {
      console.warn(`Found no vaults for ${chain.network}`);
      continue;
    }

    // update vaults from chain
    await Promise.all(
      productionVaults.map(async (vault) => {
        const fullVaultData = await sdk.vaults.loadVault({ address: vault.address });
        return updateVaultDefinition(chain, fullVaultData);
      }),
    );
    await Promise.all(
      developmentVaults.map(async (vault) => {
        const fullVaultData = await sdk.vaults.loadVault({ address: vault.address });
        return updateVaultDefinition(chain, fullVaultData);
      }),
    );

    // update isProduction status, for vaults that were already saved in ddb
    const productionVaultAddresses = productionVaults
      .map((v) => {
        try {
          return ethers.utils.getAddress(v.address);
        } catch (_) {
          return null;
        }
      })
      .filter((v) => v);

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
  let compoundVault;
  try {
    compoundVault = await constructVaultDefinition(chain, vault, isProduction);
    if (compoundVault) {
      const mapper = getDataMapper();
      await mapper.put(compoundVault);
    }
  } catch (err) {
    console.error({ err, vault: vault.name });
  }
}
