import { RegistryVault } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { constructVaultDefinition } from './indexer.utils';

export async function captureVaultData() {
  for (const chain of SUPPORTED_CHAINS) {
    const sdk = await chain.getSdk();

    let registryVaults: RegistryVault[] = [];

    try {
      registryVaults = await sdk.vaults.loadVaults(true);
    } catch (_) {
      console.error(`Registry is not defined for ${chain.network}`);
    }

    if (registryVaults.length === 0) {
      continue;
    }

    // update vaults from chain
    await Promise.all(registryVaults.map(async (vault) => updateVaultDefinition(chain, vault)));

    // update isProduction status, for vaults that were already saved in ddb
    const prdVaultsAddrs = registryVaults
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
      for await (const compoundVault of query) {
        if (!prdVaultsAddrs.includes(compoundVault.address)) {
          // mark this vault as not a prod one, mb just delete it, not sure
          compoundVault.isProduction = 0;
          await mapper.put(compoundVault);
        }
      }
    } catch (e) {
      console.error(`Failed to update isProduction status for vaults and chain: ${chain.network}`);
    }
  }

  return 'done';
}

async function updateVaultDefinition(chain: Chain, vault: RegistryVault) {
  let compoundVault;
  try {
    compoundVault = await constructVaultDefinition(chain, vault);
    if (compoundVault) {
      const mapper = getDataMapper();
      await mapper.put(compoundVault);
    }
  } catch (err) {
    console.error({ err, vault: vault.name });
  }
}
