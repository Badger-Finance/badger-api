import { DataMapper } from '@aws/dynamodb-data-mapper';
import { dynamo } from '../aws/dynamodb.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { CachedValueSource } from './interfaces/cached-value-source.interface';
import { ValueSource } from './interfaces/value-source.interface';

export const getVaultValueSources = async (sett: SettDefinition): Promise<ValueSource[]> => {
  const valueSources: ValueSource[] = [];
  const mapper = new DataMapper({ client: dynamo });
  for await (const source of mapper.query(
    CachedValueSource,
    { address: sett.settToken },
    { indexName: 'IndexApySnapshotsOnAddress' },
  )) {
    valueSources.push(source.toValueSource());
  }
  return valueSources;
};
