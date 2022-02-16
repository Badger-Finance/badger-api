import { between } from '@aws/dynamodb-expressions';
import { BadRequest, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_DAY_MS, ONE_YEAR_MS, SAMPLE_DAYS } from '../config/constants';
import { getSdk, SettQuery } from '../graphql/generated/badger';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { formatBalance, getToken } from '../tokens/tokens.utils';
import { CachedSettSnapshot } from './interfaces/cached-sett-snapshot.interface';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { VaultSnapshot } from './interfaces/vault-snapshot.interface';
import { Sett__factory, Controller__factory, Strategy__factory, EmissionControl__factory } from '../contracts';
import { VaultStrategy } from './interfaces/vault-strategy.interface';
import { TOKENS } from '../config/tokens.config';
import { Protocol, Vault, VaultState, VaultType } from '@badger-dao/sdk';
import { getPrice } from '../prices/prices.utils';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { PricingType } from '../prices/enums/pricing-type.enum';

export const VAULT_SOURCE = 'Vault Compounding';

export function defaultVault(vaultDefinition: VaultDefinition): Vault {
  const assetToken = getToken(vaultDefinition.depositToken);
  const vaultToken = getToken(vaultDefinition.vaultToken);
  return {
    asset: assetToken.symbol,
    apr: 0,
    available: 0,
    balance: 0,
    boost: {
      enabled: false,
      weight: 0,
    },
    bouncer: vaultDefinition.bouncer ?? BouncerType.None,
    name: vaultDefinition.name,
    protocol: Protocol.Badger,
    pricePerFullShare: 1,
    sources: [],
    state: vaultDefinition.state ? vaultDefinition.state : vaultDefinition.newVault ? VaultState.New : VaultState.Open,
    tokens: [],
    underlyingToken: vaultDefinition.depositToken,
    value: 0,
    vaultAsset: vaultToken.symbol,
    vaultToken: vaultDefinition.vaultToken,
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10,
    },
    type: vaultDefinition.protocol === Protocol.Badger ? VaultType.Native : VaultType.Standard,
  };
}

export async function getVault(graphUrl: string, contract: string, block?: number): Promise<SettQuery> {
  const badgerGraphqlClient = new GraphQLClient(graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  const settId = contract.toLowerCase();
  const vars = { id: settId };
  if (block) {
    return badgerGraphqlSdk.SettSnapshot({ ...vars, block: { number: block } });
  }
  return badgerGraphqlSdk.Sett(vars);
}

export async function getCachedVault(vaultDefinition: VaultDefinition): Promise<Vault> {
  const sett = defaultVault(vaultDefinition);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CachedSettSnapshot,
      { address: vaultDefinition.vaultToken },
      { limit: 1, scanIndexForward: false },
    )) {
      sett.balance = item.balance;
      sett.value = item.value;
      if (item.balance === 0 || item.supply === 0) {
        sett.pricePerFullShare = 1;
      } else if (vaultDefinition.vaultToken === TOKENS.BDIGG) {
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
}

export async function getVaultSnapshots(vaultDefinition: VaultDefinition): Promise<VaultSnapshot[]> {
  const end = Date.now();
  const start = end - ONE_DAY_MS * SAMPLE_DAYS;
  return getVaultSnapshotsInRange(vaultDefinition, new Date(start), new Date(end));
}

export const getVaultSnapshotsInRange = async (
  vaultDefinition: VaultDefinition,
  start: Date,
  end: Date,
): Promise<VaultSnapshot[]> => {
  try {
    const snapshots = [];
    const mapper = getDataMapper();
    const assetToken = getToken(vaultDefinition.vaultToken);

    for await (const snapshot of mapper.query(
      VaultSnapshot,
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

export const getPerformance = (current: VaultSnapshot, initial: VaultSnapshot): number => {
  const ratioDiff = current.ratio - initial.ratio;
  const timestampDiff = current.timestamp - initial.timestamp;
  if (timestampDiff === 0 || ratioDiff === 0) {
    return 0;
  }
  const scalar = ONE_YEAR_MS / timestampDiff;
  const finalRatio = initial.ratio + scalar * ratioDiff;
  return ((finalRatio - initial.ratio) / initial.ratio) * 100;
};

export function getVaultDefinition(chain: Chain, contract: string): VaultDefinition {
  const contractAddress = ethers.utils.getAddress(contract);
  const vaultDefinition = chain.vaults.find((v) => v.vaultToken === contractAddress);
  if (!vaultDefinition) {
    throw new NotFound(`${contract} is not a valid sett`);
  }
  return vaultDefinition;
}

export async function getStrategyInfo(chain: Chain, vaultDefinition: VaultDefinition): Promise<VaultStrategy> {
  const defaultStrategyInfo = {
    address: ethers.constants.AddressZero,
    withdrawFee: 0,
    performanceFee: 0,
    strategistFee: 0,
  };
  try {
    const contract = Sett__factory.connect(vaultDefinition.vaultToken, chain.provider);
    const controllerAddr = await contract.controller();
    if (controllerAddr === ethers.constants.AddressZero) {
      return defaultStrategyInfo;
    }
    const controller = Controller__factory.connect(controllerAddr, chain.provider);
    const strategyAddr = await controller.strategies(vaultDefinition.depositToken);
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
  vaultDefinition: VaultDefinition,
  block?: number,
): Promise<number> => {
  const token = getToken(vaultDefinition.vaultToken);
  try {
    let ppfs: BigNumber;
    const contract = Sett__factory.connect(vaultDefinition.vaultToken, chain.provider);
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

export async function getBoostWeight(chain: Chain, vaultDefinition: VaultDefinition): Promise<BigNumber> {
  if (!chain.emissionControl) {
    return ethers.constants.Zero;
  }
  const emissionControl = EmissionControl__factory.connect(chain.emissionControl, chain.provider);
  return emissionControl.boostedEmissionRate(vaultDefinition.vaultToken);
}

/**
 * Get pricing information for a vault token.
 * @param address Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
export async function getVaultTokenPrice(chain: Chain, address: string): Promise<TokenPrice> {
  const token = getToken(address);
  if (token.type !== PricingType.Vault) {
    throw new BadRequest(`${token.name} is not a vault token`);
  }
  const { vaultToken } = token;
  if (!vaultToken) {
    throw new UnprocessableEntity(`${token.name} vault token missing`);
  }
  const vaultDefintion = getVaultDefinition(chain, token.address);
  const [underlyingTokenPrice, vaultTokenSnapshot] = await Promise.all([
    getPrice(vaultToken.address),
    getCachedVault(vaultDefintion),
  ]);
  return {
    address: token.address,
    price: underlyingTokenPrice.price * vaultTokenSnapshot.pricePerFullShare,
  };
}
