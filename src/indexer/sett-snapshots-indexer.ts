import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { DEBUG } from '../config/constants';
import { successfulCapture } from '../config/util';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { settToCachedSnapshot } from './indexer.utils';

export async function refreshSettSnapshots() {
  const chains = loadChains();
  await Promise.all(chains.flatMap(async (chain) => captureChainSnapshots(chain)));
}

async function captureChainSnapshots(chain: Chain) {
  const snapshots = await Promise.all(chain.setts.map((sett) => captureSnapshot(chain, sett)));
  const toSave = snapshots.filter(successfulCapture);
  const mapper = getDataMapper();
  try {
    for await (const _item of mapper.batchPut(toSave)) {
    }
  } catch (err) {
    console.error(err);
  }
}

async function captureSnapshot(chain: Chain, sett: SettDefinition): Promise<CachedSettSnapshot | null> {
  try {
    // purposefully await to leverage try / catch
    const result = await settToCachedSnapshot(chain, sett);
    return result;
  } catch (err) {
    if (DEBUG) {
      console.error(err);
    }
    return null;
  }
}
