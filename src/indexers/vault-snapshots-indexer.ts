import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { VaultSnapshot } from '../vaults/types/vault-snapshot';
import { vaultToSnapshot } from './indexer.utils';

export async function refreshVaultSnapshots() {
  for (const chain of loadChains()) {
    await Promise.all(chain.vaults.map(async (vault) => captureSnapshot(chain, vault)));
  }
}

async function captureSnapshot(chain: Chain, vault: VaultDefinition) {
  try {
    // purposefully await to leverage try / catch
    const snapshot = await vaultToSnapshot(chain, vault);
    if (snapshot) {
      const mapper = getDataMapper();
      console.log(`${vault.name} $${snapshot.value.toLocaleString()} (${snapshot.balance} tokens)`);
      await mapper.put(Object.assign(new VaultSnapshot(), snapshot));
    }
  } catch (err) {
    console.error(err);
  }
}
