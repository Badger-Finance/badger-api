import { getDataMapper } from '../aws/dynamodb.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { Token } from '../tokens/interfaces/token.interface';
import { CachedValueSource } from './interfaces/cached-value-source.interface';
import { ValueSource } from './interfaces/value-source.interface';

export const getVaultValueSources = async (sett: SettDefinition): Promise<ValueSource[]> => {
  const valueSources = [];
  const mapper = getDataMapper();
  for await (const source of mapper.query(
    CachedValueSource,
    { address: sett.settToken },
    { indexName: 'IndexApySnapshotsOnAddress' },
  )) {
    valueSources.push(source.toValueSource());
  }
  return valueSources;
};

export const getVaultCachedValueSources = async (sett: SettDefinition): Promise<CachedValueSource[]> => {
  const valueSources = [];
  const mapper = getDataMapper();
  for await (const source of mapper.query(
    CachedValueSource,
    { address: sett.settToken },
    { indexName: 'IndexApySnapshotsOnAddress' },
  )) {
    valueSources.push(source);
  }
  return valueSources;
};

export function tokenEmission(token: Token, boosted = false): string {
  return `${boosted ? 'boosted_' : ''}${token.symbol}_${SourceType.Emission}`;
}
