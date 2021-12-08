import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { DEBUG } from '../config/constants';
import { CachedSettSnapshot } from '../vaults/interfaces/cached-sett-snapshot.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { settToCachedSnapshot } from './indexer.utils';

export async function refreshSettSnapshots() {
  const chains = loadChains();
  await Promise.all(chains.flatMap(async (chain) => captureChainSnapshots(chain)));
}

async function captureChainSnapshots(chain: Chain) {
  return Promise.all(chain.setts.map(async (sett) => captureSnapshot(chain, sett)));
}

async function captureSnapshot(chain: Chain, sett: VaultDefinition): Promise<CachedSettSnapshot | null> {
  try {
    // purposefully await to leverage try / catch
    const snapshot = await settToCachedSnapshot(chain, sett);
    if (snapshot) {
      const mapper = getDataMapper();
      await mapper.put(snapshot);
    }
    return snapshot;
  } catch (err) {
    if (DEBUG) {
      console.error(err);
    }
    return null;
  }
}
