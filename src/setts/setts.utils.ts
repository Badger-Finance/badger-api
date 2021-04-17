import { DataMapper } from '@aws/dynamodb-data-mapper';
import { GraphQLClient } from 'graphql-request';
import { dynamo } from '../aws/dynamodb-utils';
import { SAMPLE_DAYS } from '../config/constants';
import { getSdk, SettQuery, SettQueryVariables } from '../graphql/generated/badger';
import { CachedSettSnapshot } from './interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from './interfaces/sett-definition.interface';
import { SettSnapshot } from './interfaces/sett-snapshot.interface';

export const VAULT_SOURCE = 'Vault Compounding';

export const getSett = async (graphUrl: string, contract: string, block?: number): Promise<SettQuery> => {
  const badgerGraphqlClient = new GraphQLClient(graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  let vars: SettQueryVariables = {
    id: contract.toLowerCase(),
  };
  if (block) {
    vars = {
      ...vars,
      block: {
        number: block,
      },
    };
  }
  return badgerGraphqlSdk.Sett(vars);
};

export const getCachcedSett = async (sett: SettDefinition): Promise<CachedSettSnapshot> => {
  const noSett = {
    address: sett.settToken,
    balance: 0,
    ratio: 1,
    settValue: 0,
    supply: 0,
    updatedAt: Date.now(),
  };

  try {
    const mapper = new DataMapper({ client: dynamo });
    for await (const item of mapper.query(
      CachedSettSnapshot,
      { address: sett.settToken },
      { limit: 1, scanIndexForward: false },
    )) {
      return item;
    }
    return noSett;
  } catch (err) {
    console.error(err);
    return noSett;
  }
};

export const getSettSnapshots = async (sett: SettDefinition): Promise<SettSnapshot[]> => {
  try {
    const snapshots = [];
    const mapper = new DataMapper({ client: dynamo });
    for await (const snapshot of mapper.query(
      SettSnapshot,
      { asset: sett.symbol.toLowerCase() },
      { limit: SAMPLE_DAYS, scanIndexForward: false },
    )) {
      snapshots.push(snapshot);
    }
    return snapshots;
  } catch (err) {
    console.error(err);
    return [];
  }
};
