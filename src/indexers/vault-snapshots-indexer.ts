import { Network } from '@badger-dao/sdk';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { CurrentVaultSnapshot } from '../vaults/types/current-vault-snapshot';
import { vaultToSnapshot } from './indexer.utils';

export async function refreshVaultSnapshots() {
  for (const chain of loadChains()) {
    await Promise.all(chain.vaults.map(async (vault) => captureSnapshot(chain, vault)));
  }
}

async function captureSnapshot(chain: Chain, vault: VaultDefinition) {
  if (chain.network !== Network.Avalanche) {
    return;
  }
  let snapshot;
  try {
    // purposefully await to leverage try / catch
    snapshot = await vaultToSnapshot(chain, vault);
    if (snapshot) {
      const mapper = getDataMapper();
      console.log(`${vault.name} $${snapshot.value.toLocaleString()} (${snapshot.balance} tokens)`);
      await mapper.put(Object.assign(new CurrentVaultSnapshot(), snapshot));
    }
  } catch (err) {
    console.error({ err, vault: vault.name, snapshot });
  }
}
