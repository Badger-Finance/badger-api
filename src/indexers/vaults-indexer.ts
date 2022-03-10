import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { IS_OFFLINE } from '../config/constants';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { HistoricVaultSnapshot } from '../vaults/types/historic-vault-snapshot';
import { vaultToSnapshot } from './indexer.utils';

/**
 * Index a sett's historic data via the graph + web3.
 * This is an expensive process to do so locally always and
 * as such will be disabled while running offline.
 */
export async function indexProtocolVaults() {
  if (IS_OFFLINE) {
    return;
  }
  const chains = loadChains();
  await Promise.all(chains.map((chain) => indexChainVaults(chain)));
}

async function indexChainVaults(chain: Chain) {
  await Promise.all(chain.vaults.map((vault) => indexVault(chain, vault)));
}

async function indexVault(chain: Chain, vaultDefinition: VaultDefinition) {
  const mapper = getDataMapper();
  try {
    const snapshot = await vaultToSnapshot(chain, vaultDefinition);
    await mapper.put(Object.assign(new HistoricVaultSnapshot(), snapshot));
  } catch (err) {
    console.error(err);
  }
}
