import { SourceType } from '../rewards/enums/source-type.enum';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { Token } from '../tokens/interfaces/token.interface';
import { CachedValueSource } from './interfaces/cached-value-source.interface';
import { ValueSource } from './interfaces/value-source.interface';
import { getDataMapper } from '../aws/dynamodb.utils';

export const getVaultValueSources = async (vaultDefinition: VaultDefinition): Promise<ValueSource[]> => {
  const valueSources = [];
  const mapper = getDataMapper();
  for await (const source of mapper.query(
    CachedValueSource,
    { address: vaultDefinition.vaultToken },
    { indexName: 'IndexApySnapshotsOnAddress' },
  )) {
    valueSources.push(source.toValueSource());
  }
  return valueSources;
};

export const getVaultCachedValueSources = async (vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> => {
  const valueSources = [];
  const mapper = getDataMapper();
  for await (const source of mapper.query(
    CachedValueSource,
    { address: vaultDefinition.vaultToken },
    { indexName: 'IndexApySnapshotsOnAddress' },
  )) {
    valueSources.push(source);
  }
  return valueSources;
};

export function tokenEmission(token: Token, boosted = false): string {
  return `${boosted ? 'boosted_' : 'flat_'}${token.symbol}_${SourceType.Emission}`;
}
