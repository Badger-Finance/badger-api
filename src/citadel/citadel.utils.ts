import { getDataMapper } from '../aws/dynamodb.utils';
import { KeyedDataBlob } from '../aws/models/keyed-data-blob.model';
import { CitadelData, CTIADEL_DATA } from './interfaces/citadel-data.interface';

export async function queryCitadelData(): Promise<CitadelData> {
  const mapper = getDataMapper();

  let blob;
  for await (const item of mapper.query(KeyedDataBlob, { id: CTIADEL_DATA }, { limit: 1 })) {
    blob = item;
  }
  if (!blob) {
    throw new Error('No stored citadel data!');
  }

  return new CitadelData(blob.data);
}
