import { between } from '@aws/dynamodb-expressions';
import { NotFound } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_DAY_MS, ONE_YEAR_MS, SAMPLE_DAYS } from '../config/constants';
import { getSdk, SettQuery } from '../graphql/generated/badger';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { formatBalance, getToken } from '../tokens/tokens.utils';
import { CachedSettSnapshot } from './interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from './interfaces/sett-definition.interface';
import { SettSnapshot } from './interfaces/sett-snapshot.interface';
import { Sett__factory, Controller__factory, Strategy__factory, EmissionControl__factory } from '../contracts';
import { SettStrategy } from './interfaces/sett-strategy.interface';
import { TOKENS } from '../config/tokens.config';
import { Protocol, Sett, SettState } from '@badger-dao/sdk';

export const VAULT_SOURCE = 'Vault Compounding';

export const defaultSett = (settDefinition: SettDefinition): Sett => {
  const assetToken = getToken(settDefinition.depositToken);
  const vaultToken = getToken(settDefinition.settToken);
  return {
    asset: assetToken.symbol,
    apr: 0,
    balance: 0,
    boost: {
      enabled: false,
      weight: 0,
    },
    bouncer: settDefinition.bouncer ?? BouncerType.None,
    name: settDefinition.name,
    protocol: Protocol.Badger,
    pricePerFullShare: 1,
    sources: [],
    state: settDefinition.state ?? SettState.Open,
    tokens: [],
    underlyingToken: settDefinition.depositToken,
    value: 0,
    newVault: !!settDefinition.newVault,
    settAsset: vaultToken.symbol,
    settToken: settDefinition.settToken,
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10,
    },
  };
};

export const getSett = async (graphUrl: string, contract: string, block?: number): Promise<SettQuery> => {
  const badgerGraphqlClient = new GraphQLClient(graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  const settId = contract.toLowerCase();
  const vars = { id: settId };
  if (block) {
    return badgerGraphqlSdk.SettSnapshot({ ...vars, block: { number: block } });
  }
  return badgerGraphqlSdk.Sett(vars);
};

export const getCachedSett = async (settDefinition: SettDefinition): Promise<Sett> => {
  const sett = defaultSett(settDefinition);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CachedSettSnapshot,
      { address: settDefinition.settToken },
      { limit: 1, scanIndexForward: false },
    )) {
      sett.balance = item.balance;
      sett.value = item.settValue;
      if (item.balance === 0 || item.supply === 0) {
        sett.pricePerFullShare = 1;
      } else if (settDefinition.settToken === TOKENS.BDIGG) {
        sett.pricePerFullShare = item.balance / item.supply;
      } else {
        sett.pricePerFullShare = item.ratio;
      }
      sett.strategy = item.strategy;
      sett.boost = {
        enabled: item.boostWeight > 0,
        weight: item.boostWeight,
      };
    }
    return sett;
  } catch (err) {
    console.error(err);
    return sett;
  }
};

export const getSettSnapshots = async (settDefinition: SettDefinition): Promise<SettSnapshot[]> => {
  const end = Date.now();
  const start = end - ONE_DAY_MS * SAMPLE_DAYS;
  return getSettSnapshotsInRange(settDefinition, new Date(start), new Date(end));
};

export const getSettSnapshotsInRange = async (
  settDefinition: SettDefinition,
  start: Date,
  end: Date,
): Promise<SettSnapshot[]> => {
  try {
    const snapshots = [];
    const mapper = getDataMapper();
    const assetToken = getToken(settDefinition.settToken);

    for await (const snapshot of mapper.query(
      SettSnapshot,
      { address: assetToken.address, timestamp: between(new Date(start).getTime(), new Date(end).getTime()) },
      { scanIndexForward: false },
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
  const ratioDiff = current.ratio - initial.ratio;
  const timestampDiff = current.timestamp - initial.timestamp;
  if (timestampDiff === 0 || ratioDiff === 0) {
    return 0;
  }
  const scalar = ONE_YEAR_MS / timestampDiff;
  const finalRatio = initial.ratio + scalar * ratioDiff;
  return ((finalRatio - initial.ratio) / initial.ratio) * 100;
};

export const getSettDefinition = (chain: Chain, contract: string): SettDefinition => {
  const contractAddress = ethers.utils.getAddress(contract);
  const settDefinition = chain.setts.find((s) => s.settToken === contractAddress);
  if (!settDefinition) {
    throw new NotFound(`${contract} is not a valid sett`);
  }
  return settDefinition;
};

export async function getStrategyInfo(chain: Chain, sett: SettDefinition): Promise<SettStrategy> {
  const defaultStrategyInfo = {
    address: ethers.constants.AddressZero,
    withdrawFee: 0,
    performanceFee: 0,
    strategistFee: 0,
  };
  try {
    const contract = Sett__factory.connect(sett.settToken, chain.provider);
    const controllerAddr = await contract.controller();
    if (controllerAddr === ethers.constants.AddressZero) {
      return defaultStrategyInfo;
    }
    const controller = Controller__factory.connect(controllerAddr, chain.provider);
    const strategyAddr = await controller.strategies(sett.depositToken);
    if (strategyAddr === ethers.constants.AddressZero) {
      return defaultStrategyInfo;
    }
    const strategy = Strategy__factory.connect(strategyAddr, chain.provider);
    const [withdrawFee, performanceFee, strategistFee] = await Promise.all([
      strategy.withdrawalFee(),
      strategy.performanceFeeGovernance(),
      strategy.performanceFeeStrategist(),
    ]);
    return {
      address: strategy.address,
      withdrawFee: withdrawFee.toNumber(),
      performanceFee: performanceFee.toNumber(),
      strategistFee: strategistFee.toNumber(),
    };
  } catch (err) {
    return defaultStrategyInfo;
  }
}

export const getPricePerShare = async (
  chain: Chain,
  pricePerShare: BigNumber,
  sett: SettDefinition,
  block?: number,
): Promise<number> => {
  const token = getToken(sett.settToken);
  try {
    let ppfs: BigNumber;
    const contract = Sett__factory.connect(sett.settToken, chain.provider);
    if (block) {
      ppfs = await contract.getPricePerFullShare({ blockTag: block });
    } else {
      ppfs = await contract.getPricePerFullShare();
    }
    return formatBalance(ppfs, token.decimals);
  } catch (err) {
    return formatBalance(pricePerShare, token.decimals);
  }
};

export async function getBoostWeight(chain: Chain, settDefinition: SettDefinition): Promise<BigNumber> {
  if (!chain.emissionControl) {
    return ethers.constants.Zero;
  }
  const emissionControl = EmissionControl__factory.connect(chain.emissionControl, chain.provider);
  return emissionControl.boostedEmissionRate(settDefinition.settToken);
}
