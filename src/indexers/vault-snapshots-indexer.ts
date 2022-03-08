import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { CachedVaultSnapshot } from '../vaults/interfaces/cached-vault-snapshot.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { vaultToCachedSnapshot } from './indexer.utils';

export async function refreshVaultSnapshots() {
  for (const chain of loadChains()) {
    await Promise.all(chain.vaults.map(async (vault) => captureSnapshot(chain, vault)));
  }
}

async function captureSnapshot(chain: Chain, vault: VaultDefinition): Promise<CachedVaultSnapshot | null> {
  try {
    // purposefully await to leverage try / catch
    const snapshot = await vaultToCachedSnapshot(chain, vault);
    if (snapshot) {
      const mapper = getDataMapper();
      console.log(`${vault.name} $${snapshot.value.toLocaleString()} (${snapshot.balance} tokens)`);
      await mapper.put(snapshot);
    }
    return snapshot;
  } catch (err) {
    console.error(err);
    return null;
  }
}
