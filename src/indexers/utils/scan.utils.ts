import { BlocksRangeOptions } from '@badger-dao/sdk/lib/common';
import { Network } from '@badger-dao/sdk/lib/config/enums/network.enum';

import { getDataMapper } from '../../aws/dynamodb.utils';
import { IndexingMetadata } from '../../aws/models/indexing-metadata.model';
import { MAX_SCAN_RANGE } from '../constants/scan.constants';
import { LastScannedBlockMeta } from '../interfaces/last-scanned-block-meta.interface';

export async function getOrCreateMetadata<T>(task: string, defaultValue: T): Promise<IndexingMetadata<T>> {
  const mapper = getDataMapper();

  let metadata!: IndexingMetadata<T>;

  try {
    metadata = await mapper.get(Object.assign(new IndexingMetadata<T>(), { task }));
  } catch (e) {
    metadata = Object.assign(new IndexingMetadata<T>(), { task, data: defaultValue });
  }

  return metadata;
}

export function getLastScannedBlockDefault(): LastScannedBlockMeta {
  return Object.values(Network).reduce((acc, network) => {
    acc[`${<Network>network}`] = { lastScannedBlock: 0 };
    return acc;
  }, <LastScannedBlockMeta>{});
}

export function getScanRangeOpts(
  fromChain: Required<BlocksRangeOptions>,
  lastScannedBlock: number,
): Required<BlocksRangeOptions> {
  const startBlock = lastScannedBlock > 0 ? lastScannedBlock + 1 : fromChain.startBlock;
  let endBlock = fromChain.endBlock;

  if (endBlock - startBlock > MAX_SCAN_RANGE) {
    endBlock = startBlock + MAX_SCAN_RANGE;
  }

  return {
    startBlock,
    endBlock,
  };
}

export async function saveIndexingMetadata<T>(model: IndexingMetadata<T>): Promise<void> {
  const mapper = getDataMapper();

  try {
    await mapper.put(model);
  } catch (e) {
    console.error(`Failed to save indexing metadata for ${model.task}`, e);
  }
}
