import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { DEBUG } from '../config/constants';
import { successfulCapture } from '../config/util';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { settToCachedSnapshot } from './indexer.utils';

const captureSnapshot = async (chain: Chain, sett: SettDefinition): Promise<CachedSettSnapshot | null> => {
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
};

export async function refreshSettSnapshots() {
  const chains = loadChains();
  const snapshots = await Promise.all(
    chains.flatMap((chain) => chain.setts.map((sett) => captureSnapshot(chain, sett))),
  );
  const mapper = getDataMapper();
  for (const snapshot of snapshots.filter(successfulCapture)) {
    try {
      await mapper.put(snapshot);
    } catch (err) {
      console.log({ message: err.message, snapshot });
    }
  }
}
