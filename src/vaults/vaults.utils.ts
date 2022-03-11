import { between } from '@aws/dynamodb-expressions';
import { BadRequest, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { ONE_DAY_MS, ONE_YEAR_SECONDS } from '../config/constants';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { formatBalance, getToken } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { EmissionControl__factory } from '../contracts';
import { VaultStrategy } from './interfaces/vault-strategy.interface';
import { TOKENS } from '../config/tokens.config';
import {
  keyBy,
  Network,
  Protocol,
  Vault,
  VaultBehavior,
  VaultHarvestEvent,
  VaultState,
  VaultType,
} from '@badger-dao/sdk';
import { getPrice } from '../prices/prices.utils';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { getProtocolValueSources, getRewardEmission, valueSourceToCachedValueSource } from '../rewards/rewards.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getVaultCachedValueSources, tokenEmission } from '../protocols/protocols.utils';
import { getVault } from '../indexers/indexer.utils';
import { HistoricVaultSnapshot } from './types/historic-vault-snapshot';
import { VaultSnapshot } from './types/vault-snapshot';
import { VaultTreeDistributionEvent } from '@badger-dao/sdk/lib/vaults/interfaces/vault-tree-distribution-event.interface';

export const VAULT_SOURCE = 'Vault Compounding';

export function defaultVault(vaultDefinition: VaultDefinition): Vault {
  const assetToken = getToken(vaultDefinition.depositToken);
  const vaultToken = getToken(vaultDefinition.vaultToken);
  return {
    asset: assetToken.symbol,
    apr: 0,
    apy: 0,
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
    sourcesApy: [],
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
    behavior: vaultDefinition.behavior ?? VaultBehavior.None,
  };
}

export async function getCachedVault(vaultDefinition: VaultDefinition): Promise<Vault> {
  const vault = defaultVault(vaultDefinition);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      VaultSnapshot,
      { address: vaultDefinition.vaultToken },
      { limit: 1, scanIndexForward: false },
    )) {
      vault.balance = item.balance;
      vault.value = item.value;
      if (item.balance === 0 || item.totalSupply === 0) {
        vault.pricePerFullShare = 1;
      } else if (vaultDefinition.vaultToken === TOKENS.BDIGG) {
        vault.pricePerFullShare = item.balance / item.totalSupply;
      } else {
        vault.pricePerFullShare = item.pricePerFullShare;
      }
      vault.strategy = item.strategy;
      vault.boost = {
        enabled: item.boostWeight > 0,
        weight: item.boostWeight,
      };
    }
    return vault;
  } catch (err) {
    console.error(err);
    return vault;
  }
}

export async function getVaultSnapshotsInRange(
  vaultDefinition: VaultDefinition,
  start: Date,
  end: Date,
): Promise<HistoricVaultSnapshot[]> {
  try {
    const snapshots = [];
    const mapper = getDataMapper();
    const assetToken = getToken(vaultDefinition.vaultToken);

    for await (const snapshot of mapper.query(
      HistoricVaultSnapshot,
      { address: assetToken.address, timestamp: between(new Date(start).getTime(), new Date(end).getTime()) },
      { scanIndexForward: false },
    )) {
      if (!snapshot.pricePerFullShare && snapshot.ratio) {
        snapshot.pricePerFullShare = snapshot.ratio;
      }
      snapshots.push(snapshot);
    }
    return snapshots;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function getVaultDefinition(chain: Chain, contract: string): VaultDefinition {
  const contractAddress = ethers.utils.getAddress(contract);
  const vaultDefinition = chain.vaults.find((v) => v.vaultToken === contractAddress);
  if (!vaultDefinition) {
    throw new NotFound(`${contract} is not a valid sett`);
  }
  return vaultDefinition;
}

// TODO: migration to SDK is probably the best option here
export async function getStrategyInfo(chain: Chain, vaultDefinition: VaultDefinition): Promise<VaultStrategy> {
  const defaultStrategyInfo = {
    address: ethers.constants.AddressZero,
    withdrawFee: 0,
    performanceFee: 0,
    strategistFee: 0,
  };
  try {
    const sdk = await chain.getSdk();
    const strategy = await sdk.vaults.getVaultStrategy(vaultDefinition.vaultToken);
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
  const isCrossChainVault = chain.network !== vaultToken.network;
  const targetChain = isCrossChainVault ? Chain.getChain(vaultToken.network) : chain;
  const targetVault = isCrossChainVault ? vaultToken.address : token.address;
  const vaultDefintion = getVaultDefinition(targetChain, targetVault);
  const [underlyingTokenPrice, vaultTokenSnapshot] = await Promise.all([
    getPrice(vaultToken.address),
    getCachedVault(vaultDefintion),
  ]);
  return {
    address: token.address,
    price: underlyingTokenPrice.price * vaultTokenSnapshot.pricePerFullShare,
  };
}

// TODO: probably break this up
export async function getVaultPerformance(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  const [rewardEmissions, protocol] = await Promise.all([
    getRewardEmission(chain, vaultDefinition),
    getProtocolValueSources(chain, vaultDefinition),
  ]);
  let vaultSources = [];
  try {
    vaultSources = await loadVaultEventPerformances(chain, vaultDefinition);
    vaultSources.push();
  } catch (err) {
    console.error(err);
    console.log(`${vaultDefinition.name} fallback to APR estimation from badger subgraph`);
    vaultSources = await loadVaultGraphPerformances(chain, vaultDefinition);
  }
  return [...vaultSources, ...rewardEmissions, ...protocol];
}

export async function loadVaultEventPerformances(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  const incompatibleNetworks = new Set<Network>([Network.BinanceSmartChain, Network.Polygon, Network.Arbitrum]);
  if (incompatibleNetworks.has(chain.network)) {
    throw new Error('Network does not have standardized vaults!');
  }

  const sdk = await chain.getSdk();
  const cutoff = (Date.now() - ONE_DAY_MS * 21) / 1000;
  const { data } = await sdk.vaults.listHarvests({ address: vaultDefinition.vaultToken, timestamp_gte: cutoff });

  return estimateVaultPerformance(chain, vaultDefinition, data);
}

export function estimateDerivativeEmission(
  compoundApr: number,
  emissionApr: number,
  emissionCompoundApr: number,
): number {
  let currentValueCompounded = 100;
  let currentValueEmitted = 0;
  let currentValueEmittedCompounded = 0;
  for (let i = 0; i < 365; i++) {
    const emitted = currentValueCompounded * (emissionApr / 365);
    currentValueCompounded += currentValueCompounded * (compoundApr / 365);
    const emittedCompounded = currentValueEmitted * (emissionCompoundApr / 365);
    currentValueEmitted += emitted;
    currentValueEmittedCompounded += emittedCompounded;
    currentValueEmitted += emittedCompounded;
  }
  const total = currentValueCompounded + currentValueEmitted + currentValueEmittedCompounded;
  return (currentValueEmittedCompounded / total) * 100;
}

export interface VaultHarvestData {
  timestamp: number;
  harvests: VaultHarvestEvent[];
  treeDistributions: VaultTreeDistributionEvent[];
}

// subgraph based emissions retrieval
// should we put this into the sdk?
export async function loadVaultGraphPerformances(chain: Chain, vault: VaultDefinition) {
  const { vaultToken, depositToken } = vault;

  const sdk = await chain.getSdk();
  const cutoff = (Date.now() - ONE_DAY_MS * 21) / 1000;
  const [vaultHarvests, treeDistributions] = await Promise.all([
    sdk.graph.loadSettHarvests({
      where: {
        id: vaultToken.toLowerCase(),
        timestamp_gte: cutoff,
      },
    }),
    sdk.graph.loadBadgerTreeDistributions({
      where: {
        id: vaultToken.toLowerCase(),
        timestamp_gte: cutoff,
      },
    }),
    sdk.tokens.loadToken(depositToken),
  ]);

  const { settHarvests } = vaultHarvests;
  const { badgerTreeDistributions } = treeDistributions;

  const harvestsByTimestamp = keyBy(settHarvests, (harvest) => harvest.timestamp);
  const treeDistributionsByTimestamp = keyBy(badgerTreeDistributions, (distribution) => distribution.timestamp);
  const timestamps = [...new Set([...Object.keys(harvestsByTimestamp), ...Object.keys(treeDistributionsByTimestamp)])];
  const data = timestamps.map((t) => {
    const timestamp = Number(t);
    const currentHarvests = harvestsByTimestamp.get(timestamp) ?? [];
    const currentDistributions = treeDistributionsByTimestamp.get(timestamp) ?? [];
    return {
      timestamp,
      harvests: currentHarvests.map((h) => ({ timestamp, block: h.blockNumber, harvested: h.amount })),
      treeDistributions: currentDistributions.map((d) => ({
        timestamp,
        block: d.blockNumber,
        token: d.token.id,
        amount: d.amount,
      })),
    };
  });

  return estimateVaultPerformance(chain, vault, data);
}

async function estimateVaultPerformance(
  chain: Chain,
  vaultDefinition: VaultDefinition,
  data: VaultHarvestData[],
): Promise<CachedValueSource[]> {
  const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);

  if (recentHarvests.length <= 1) {
    throw new Error('Vault does not have adequate harvest history!');
  }

  const vault = await getCachedVault(vaultDefinition);
  const measuredHarvests = recentHarvests.slice(0, recentHarvests.length - 1);
  const valueSources = [];

  const harvests = measuredHarvests.flatMap((h) => h.harvests);
  const totalHarvested = harvests
    .map((h) => h.harvested)
    .reduce((total, harvested) => total.add(harvested), BigNumber.from(0));

  let totalDuration = 0;
  let weightedBalance = 0;
  const depositToken = getToken(vaultDefinition.depositToken);
  const allHarvests = recentHarvests.flatMap((h) => h.harvests);
  // use the full harvests to construct all intervals for durations, nth element is ignored for distributions
  for (let i = 0; i < recentHarvests.length - 1; i++) {
    const end = allHarvests[i];
    const start = allHarvests[i + 1];
    const duration = end.timestamp - start.timestamp;
    totalDuration += duration;
    const { sett } = await getVault(chain, vaultDefinition.vaultToken, end.block);
    if (sett) {
      weightedBalance += duration * formatBalance(sett.balance, depositToken.decimals);
    } else {
      weightedBalance += duration * vault.balance;
    }
  }

  const { price } = await getPrice(vaultDefinition.depositToken);
  const measuredBalance = weightedBalance / totalDuration;
  const measuredValue = measuredBalance * price;

  const totalHarvestedTokens = formatBalance(totalHarvested, depositToken.decimals);
  // count of harvests is exclusive of the 0th element
  const durationScalar = ONE_YEAR_SECONDS / totalDuration;
  // take the less frequent period, the actual harvest frequency or daily
  const periods = Math.min(365, durationScalar * (measuredHarvests.length - 1));
  const compoundApr = (totalHarvestedTokens / measuredBalance) * durationScalar;
  const compoundApy = (1 + compoundApr / periods) ** periods - 1;
  const compoundSourceApr = createValueSource(VAULT_SOURCE, compoundApr * 100);
  const cachedCompoundSourceApr = valueSourceToCachedValueSource(
    compoundSourceApr,
    vaultDefinition,
    SourceType.PreCompound,
  );
  valueSources.push(cachedCompoundSourceApr);
  const compoundSource = createValueSource(VAULT_SOURCE, compoundApy * 100);
  const cachedCompoundSource = valueSourceToCachedValueSource(compoundSource, vaultDefinition, SourceType.Compound);
  valueSources.push(cachedCompoundSource);

  const treeDistributions = measuredHarvests.flatMap((h) => h.treeDistributions);
  const tokensEmitted = new Map<string, BigNumber>();
  for (const distribution of treeDistributions) {
    const { token, amount } = distribution;
    let entry = tokensEmitted.get(token);
    if (!entry) {
      entry = BigNumber.from(0);
      tokensEmitted.set(token, entry);
    }
    tokensEmitted.set(token, entry.add(amount));
  }

  for (const [token, amount] of tokensEmitted.entries()) {
    const { price } = await getPrice(token);
    if (price === 0) {
      continue;
    }
    const tokenEmitted = getToken(token);
    const tokensEmitted = formatBalance(amount, tokenEmitted.decimals);
    const valueEmitted = tokensEmitted * price;
    const emissionApr = (valueEmitted / measuredValue) * durationScalar;
    const emissionSource = createValueSource(`${tokenEmitted.symbol} Rewards`, emissionApr * 100);
    const cachedEmissionSource = valueSourceToCachedValueSource(
      emissionSource,
      vaultDefinition,
      tokenEmission(tokenEmitted),
    );
    valueSources.push(cachedEmissionSource);
    // try to add underlying emitted vault value sources if applicable
    try {
      const emittedVault = getVaultDefinition(chain, tokenEmitted.address);
      const vaultValueSources = await getVaultCachedValueSources(emittedVault);
      // search for the persisted apr variant of the compounding vault source, if any
      const compoundingSource = vaultValueSources.find((source) => source.type === SourceType.PreCompound);
      if (compoundingSource) {
        const compoundingSourceApy = estimateDerivativeEmission(compoundApr, emissionApr, compoundingSource.apr / 100);
        const sourceName = `${getToken(emittedVault.vaultToken).name} Compounding`;
        const sourceType = `Derivative ${sourceName}`.replace(' ', '_').toLowerCase();
        const derivativeSource = createValueSource(sourceName, compoundingSourceApy);
        valueSources.push(valueSourceToCachedValueSource(derivativeSource, vaultDefinition, sourceType));
      }
    } catch {} // ignore error for non vaults
  }

  return valueSources;
}
