import { DataMapper } from '@aws/dynamodb-data-mapper';
import { dynamo } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
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
    console.error(err);
    return null;
  }
};

export async function refreshSettSnapshots() {
  const chains = loadChains();
  const snapshots = await Promise.all(
    chains.flatMap((chain) => chain.setts.map((sett) => captureSnapshot(chain, sett))),
  );
  const mapper = new DataMapper({ client: dynamo });
  for (const snapshot of snapshots.filter(successfulCapture)) {
    await mapper.put(snapshot);
  }
}
