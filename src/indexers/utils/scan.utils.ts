import { Network } from '@badger-dao/sdk';
import { BlocksRangeOptions } from '@badger-dao/sdk/lib/common';

import { getDataMapper } from '../../aws/dynamodb.utils';
import { IndexingMetadata } from '../../aws/models/indexing-metadata.model';
import { MAX_SCAN_RANGE } from '../constants/scan.constants';
import { LastScannedBlockMeta } from '../interfaces/last-scanned-block-meta.interface';

export async function getOrCreateMetadata<T>(task: string): Promise<IndexingMetadata<T>> {
  const mapper = getDataMapper();

  let metadata!: IndexingMetadata<T>;

  try {
    metadata = await mapper.get(Object.assign(new IndexingMetadata<T>(), { task }));
  } catch (e) {
    metadata = Object.assign(new IndexingMetadata<T>(), { task, data: {} });
  }

  return metadata;
}

export function getLastScanedBlock<T extends LastScannedBlockMeta>(
  indexingMetaData: T,
  network: Network,
  address: string,
) {
  return indexingMetaData[network]?.[address]?.lastScannedBlock || 0;
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
