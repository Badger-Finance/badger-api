import { BadRequest, NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_YEAR_MS, SAMPLE_DAYS } from '../config/constants';
import { getSdk, SettQuery, SettQueryVariables } from '../graphql/generated/badger';
import { CachedSettSnapshot } from './interfaces/cached-sett-snapshot.interface';
import { Sett } from './interfaces/sett.interface.';
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

export const getCachcedSett = async (settDefinition: SettDefinition): Promise<Sett> => {
  const sett: Sett = {
    asset: settDefinition.symbol,
    apy: 0,
    balance: 0,
    hasBouncer: !!settDefinition.hasBouncer,
    name: settDefinition.name,
    ppfs: 1,
    sources: [],
    tokens: [],
    underlyingToken: settDefinition.depositToken,
    value: 0,
    vaultToken: settDefinition.settToken,
  };

  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CachedSettSnapshot,
      { address: settDefinition.settToken },
      { limit: 1, scanIndexForward: false },
    )) {
      sett.balance = item.balance;
      sett.ppfs = item.ratio;
      sett.value = item.settValue;
    }
    return sett;
  } catch (err) {
    console.error(err);
    return sett;
  }
};

export const getSettSnapshots = async (sett: SettDefinition): Promise<SettSnapshot[]> => {
  try {
    const snapshots = [];
    const mapper = getDataMapper();
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

export const getPerformance = (current: SettSnapshot, initial: SettSnapshot): number => {
  if (!current || !initial) {
    return 0;
  }
  const ratioDiff = current.ratio - initial.ratio;
  const timestampDiff = current.timestamp - initial.timestamp;
  const scalar = ONE_YEAR_MS / timestampDiff;
  const finalRatio = initial.ratio + scalar * ratioDiff;
  return ((finalRatio - initial.ratio) / initial.ratio) * 100;
};

export const getSettDefinition = (chain: Chain, contract: string): SettDefinition => {
  if (!contract) {
    throw new BadRequest('contract address is required');
  }

  const contractAddress = ethers.utils.getAddress(contract);
  const settDefinition = chain.setts.find((s) => s.settToken === contractAddress);

  if (!settDefinition) {
    throw new NotFound(`${contract} is not a valid sett`);
  }

  return settDefinition;
};
