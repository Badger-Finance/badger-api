import { between } from '@aws/dynamodb-expressions';
import { BadRequest, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { DEBUG, ONE_DAY_MS, ONE_YEAR_MS, ONE_YEAR_SECONDS } from '../config/constants';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { getFullToken, tokenEmission } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { EmissionControl__factory } from '../contracts';
import { VaultStrategy } from './interfaces/vault-strategy.interface';
import { TOKENS } from '../config/tokens.config';
import {
  formatBalance,
  gqlGenT,
  keyBy,
  Network,
  Protocol,
  VaultBehavior,
  VaultDTO,
  VaultState,
  VaultType,
  VaultVersion,
} from '@badger-dao/sdk';
import { getPrice } from '../prices/prices.utils';
import { TokenPrice } from '../prices/interface/token-price.interface';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { getProtocolValueSources, getRewardEmission, valueSourceToCachedValueSource } from '../rewards/rewards.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getVault } from '../indexers/indexer.utils';
import { HistoricVaultSnapshot } from './types/historic-vault-snapshot';
import { VaultHarvestData } from './interfaces/vault-harvest-data.interface';
import { CurrentVaultSnapshot } from './types/current-vault-snapshot';
import { VaultPendingHarvestData } from './types/vault-pending-harvest-data';

export const VAULT_SOURCE = 'Vault Compounding';

export async function defaultVault(
  chain: Chain,
  vaultDefinition: VaultDefinition,
  version: VaultVersion = VaultVersion.v1,
): Promise<VaultDTO> {
  const [assetToken, vaultToken] = await Promise.all([
    getFullToken(chain, vaultDefinition.depositToken),
    getFullToken(chain, vaultDefinition.vaultToken),
  ]);

  const state = vaultDefinition.state
    ? vaultDefinition.state
    : vaultDefinition.newVault
    ? VaultState.New
    : VaultState.Open;
  const bouncer = vaultDefinition.bouncer ?? BouncerType.None;
  const type = vaultDefinition.protocol === Protocol.Badger ? VaultType.Native : VaultType.Standard;
  const behavior = vaultDefinition.behavior ?? VaultBehavior.None;

  return {
    apr: 0,
    apy: 0,
    asset: assetToken.symbol,
    available: 0,
    balance: 0,
    behavior,
    boost: {
      enabled: false,
      weight: 0,
    },
    bouncer,
    name: vaultDefinition.name,
    pricePerFullShare: 1,
    protocol: Protocol.Badger,
    sources: [],
    sourcesApy: [],
    state,
    tokens: [],
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 0,
    },
    type,
    underlyingToken: vaultDefinition.depositToken,
    value: 0,
    vaultAsset: vaultToken.symbol,
    vaultToken: vaultDefinition.vaultToken,
    yieldProjection: {
      yieldApr: 0,
      yieldTokens: [],
      yieldValue: 0,
      harvestApr: 0,
      harvestApy: 0,
      harvestTokens: [],
      harvestValue: 0,
    },
    lastHarvest: 0,
    version,
  };
}

export async function getCachedVault(chain: Chain, vaultDefinition: VaultDefinition): Promise<VaultDTO> {
  const vault = await defaultVault(chain, vaultDefinition);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CurrentVaultSnapshot,
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
  chain: Chain,
  vaultDefinition: VaultDefinition,
  start: Date,
  end: Date,
): Promise<HistoricVaultSnapshot[]> {
  try {
    const snapshots = [];
    const mapper = getDataMapper();
    const assetToken = await getFullToken(chain, vaultDefinition.vaultToken);

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
  try {
    const emissionControl = EmissionControl__factory.connect(chain.emissionControl, chain.provider);
    return emissionControl.boostedEmissionRate(vaultDefinition.vaultToken);
  } catch (err) {
    console.error(err);
    return ethers.constants.Zero;
  }
}

/**
 * Get pricing information for a vault token.
 * @param chain Block chain instance
 * @param address Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
export async function getVaultTokenPrice(chain: Chain, address: string): Promise<TokenPrice> {
  const token = await getFullToken(chain, address);
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
    getCachedVault(chain, vaultDefintion),
  ]);

  const result = {
    address: token.address,
    price: underlyingTokenPrice.price * vaultTokenSnapshot.pricePerFullShare,
  };

  if (isNaN(result.price)) {
    console.log({ result, address, underlyingTokenPrice, vaultTokenSnapshot });
  }

  return result;
}

/**
 * Load a Badger vault measured performance.
 * @param chain Chain vault is deployed on
 * @param vaultDefinition Vault definition of requested vault
 * @returns Value source array describing vault performance
 */
export async function getVaultPerformance(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  const [rewardEmissions, protocol] = await Promise.all([
    getRewardEmission(chain, vaultDefinition),
    getProtocolValueSources(chain, vaultDefinition),
  ]);
  let vaultSources: CachedValueSource[] = [];
  try {
    vaultSources = await loadVaultEventPerformances(chain, vaultDefinition);
  } catch (err) {
    if (DEBUG) {
      console.log(`${vaultDefinition.name} vault APR estimation fallback to badger subgraph`);
    }
    vaultSources = await loadVaultGraphPerformances(chain, vaultDefinition);
  }
  const vaultApr = vaultSources.reduce((total, s) => total + s.apr, 0);
  // if we are not able to measure any on chain, or graph based increases falleback to ppfs measurement
  if (vaultApr === 0) {
    vaultSources = await getVaultUnderlyingPerformance(chain, vaultDefinition);
  }
  return [...vaultSources, ...rewardEmissions, ...protocol];
}

export async function getVaultUnderlyingPerformance(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const snapshots = await getVaultSnapshotsInRange(chain, vaultDefinition, start, new Date());
  if (snapshots.length === 0) {
    return [];
  }
  const currentSnapshot = snapshots[0];
  const historicSnapshot = snapshots[snapshots.length - 1];
  const currentPpfs = currentSnapshot.pricePerFullShare ?? currentSnapshot.ratio;
  const historicPpfs = historicSnapshot.pricePerFullShare ?? historicSnapshot.ratio;
  const deltaPpfs = currentPpfs - historicPpfs;
  const deltaTime = currentSnapshot.timestamp - historicSnapshot.timestamp;
  let underlyingApr = 0;
  if (deltaTime > 0 && deltaPpfs > 0) {
    underlyingApr = (deltaPpfs / historicPpfs) * (ONE_YEAR_MS / deltaTime) * 100;
  }
  const source = createValueSource(VAULT_SOURCE, underlyingApr);
  return [
    valueSourceToCachedValueSource(source, vaultDefinition, SourceType.PreCompound),
    valueSourceToCachedValueSource(source, vaultDefinition, SourceType.Compound),
  ];
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

  if (vaultDefinition.vaultToken === TOKENS.BVECVX) {
    console.log({
      data,
    });
  }

  return estimateVaultPerformance(chain, vaultDefinition, data);
}

/**
 * Extrapolates a one year APR for a given vault based on compounding and emissions based on $100 deposit.
 * @param compoundApr Base compound APR of vault
 * @param emissionApr Emission APR of the emitted vault
 * @param emissionCompoundApr Derivative compound APR of the tmitted vault
 * @returns Extraposedat one year APR given current yields continue
 */
export function estimateDerivativeEmission(
  compoundApr: number,
  emissionApr: number,
  emissionCompoundApr: number,
  compoundingStep = 1,
  emissionStep = 1,
): number {
  // start with $100 deposited into the vault
  let currentValueCompounded = 100;
  let currentValueEmitted = 0;
  let currentValueEmittedCompounded = 0;
  let lastEmissionTime = 0;
  const emissionsDivisor = 365 / emissionStep;
  const compoundingDivisor = 365 / compoundingStep;
  for (let i = 0; i < 365; i += compoundingStep) {
    currentValueCompounded += currentValueCompounded * (compoundApr / compoundingDivisor);
    // accrue compounded yield from emitted tokens
    const emittedCompounded = currentValueEmitted * (emissionCompoundApr / compoundingDivisor);

    // We only accrue emissions if there was an emissions event
    if (lastEmissionTime + emissionStep >= i) {
      // accrue emitted yield from emissionApr
      const emitted = currentValueCompounded * (emissionApr / emissionsDivisor);
      // account for total yield emitted
      currentValueEmitted += emitted;
      lastEmissionTime = i;
    }

    // account for the actual compounding portion on the emitted yield (what we are looking for)
    currentValueEmittedCompounded += emittedCompounded;
    // account for the compounded yield
    currentValueEmitted += emittedCompounded;
  }

  const total = currentValueCompounded + currentValueEmitted;
  return (currentValueEmittedCompounded / total) * 100;
}

// subgraph based emissions retrieval
// should we put this into the sdk?
export async function loadVaultGraphPerformances(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  const { vaultToken } = vaultDefinition;

  const sdk = await chain.getSdk();
  const cutoff = Number(((Date.now() - ONE_DAY_MS * 21) / 1000).toFixed());

  let [vaultHarvests, treeDistributions] = await Promise.all([
    sdk.graph.loadSettHarvests({
      where: {
        sett: vaultToken.toLowerCase(),
        timestamp_gte: cutoff,
      },
    }),
    sdk.graph.loadBadgerTreeDistributions({
      where: {
        sett: vaultToken.toLowerCase(),
        timestamp_gte: cutoff,
      },
    }),
  ]);

  let { settHarvests } = vaultHarvests;
  let { badgerTreeDistributions } = treeDistributions;

  let data = constructGraphVaultData(vaultDefinition, settHarvests, badgerTreeDistributions);
  // if there are no recent viable options, attempt to use the full vault history
  if (data.length <= 1) {
    [vaultHarvests, treeDistributions] = await Promise.all([
      sdk.graph.loadSettHarvests({
        where: {
          sett: vaultToken.toLowerCase(),
        },
      }),
      sdk.graph.loadBadgerTreeDistributions({
        where: {
          sett: vaultToken.toLowerCase(),
        },
      }),
    ]);
    settHarvests = vaultHarvests.settHarvests;
    badgerTreeDistributions = treeDistributions.badgerTreeDistributions;
    if (DEBUG) {
      console.log(
        `OVERRIDE ${vaultDefinition.name} with full historic harvest data (${
          settHarvests.length + badgerTreeDistributions.length
        })`,
      );
    }
  }

  data = constructGraphVaultData(vaultDefinition, settHarvests, badgerTreeDistributions);
  // if we still don't have harvests or distributions - don't bother there is nothing to compute
  if (data.length <= 1) {
    return [];
  }

  return estimateVaultPerformance(chain, vaultDefinition, data);
}

function constructGraphVaultData(
  vaultDefinition: VaultDefinition,
  settHarvests: gqlGenT.SettHarvestsQuery['settHarvests'],
  badgerTreeDistributions: gqlGenT.BadgerTreeDistributionsQuery['badgerTreeDistributions'],
): VaultHarvestData[] {
  const harvestsByTimestamp = keyBy(settHarvests, (harvest) => harvest.timestamp);
  const treeDistributionsByTimestamp = keyBy(badgerTreeDistributions, (distribution) => distribution.timestamp);
  const timestamps = Array.from(
    new Set([...harvestsByTimestamp.keys(), ...treeDistributionsByTimestamp.keys()]).values(),
  );
  return timestamps.map((t) => {
    const timestamp = Number(t);
    const currentHarvests = harvestsByTimestamp.get(timestamp) ?? [];
    const currentDistributions = treeDistributionsByTimestamp.get(timestamp) ?? [];
    return {
      timestamp,
      harvests: currentHarvests.map((h) => ({
        timestamp,
        block: Number(h.blockNumber),
        token: vaultDefinition.depositToken,
        amount: h.amount,
      })),
      treeDistributions: currentDistributions.map((d) => ({
        timestamp,
        block: Number(d.blockNumber),
        token: d.token.id,
        amount: d.amount,
      })),
    };
  });
}

async function estimateVaultPerformance(
  chain: Chain,
  vaultDefinition: VaultDefinition,
  data: VaultHarvestData[],
): Promise<CachedValueSource[]> {
  const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);

  if (recentHarvests.length <= 1) {
    throw new Error(`${vaultDefinition.name} does not have adequate harvest history`);
  }

  const vault = await getCachedVault(chain, vaultDefinition);
  const measuredHarvests = recentHarvests.slice(0, recentHarvests.length - 1);
  const valueSources = [];

  const harvests = measuredHarvests.flatMap((h) => h.harvests);
  const totalHarvested = harvests
    .map((h) => h.amount)
    .reduce((total, harvested) => total.add(harvested), BigNumber.from(0));

  let totalDuration = 0;
  let weightedBalance = 0;
  const depositToken = await getFullToken(chain, vaultDefinition.depositToken);

  const allHarvests = recentHarvests.flatMap((h) => h.harvests);
  // use the full harvests to construct all intervals for durations, nth element is ignored for distributions
  for (let i = 0; i < recentHarvests.length - 1; i++) {
    const end = allHarvests[i];
    const start = allHarvests[i + 1];
    const duration = end.timestamp - start.timestamp;
    totalDuration += duration;
    const { sett } = await getVault(chain, vaultDefinition.vaultToken, end.block);
    if (sett) {
      const balance = sett.strategy?.balance ?? sett.balance;
      weightedBalance += duration * formatBalance(balance, depositToken.decimals);
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
    const tokenEmitted = await getFullToken(chain, token);

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
        const vaultToken = await getFullToken(chain, emittedVault.vaultToken);

        const sourceName = `${vaultToken.name} Compounding`;
        const sourceType = `Derivative ${sourceName}`.replace(' ', '_').toLowerCase();
        const derivativeSource = createValueSource(sourceName, compoundingSourceApy);
        valueSources.push(valueSourceToCachedValueSource(derivativeSource, vaultDefinition, sourceType));
      }
    } catch {} // ignore error for non vaults
  }

  return valueSources;
}

export async function getVaultCachedValueSources(vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
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
}

export async function getVaultPendingHarvest(vaultDefinition: VaultDefinition): Promise<VaultPendingHarvestData> {
  let pendingHarvest: VaultPendingHarvestData = {
    vault: vaultDefinition.vaultToken,
    yieldTokens: [],
    harvestTokens: [],
    lastHarvestedAt: 0,
  };
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      VaultPendingHarvestData,
      { vault: vaultDefinition.vaultToken },
      { limit: 1 },
    )) {
      pendingHarvest.yieldTokens = item.yieldTokens;
      pendingHarvest.harvestTokens = item.harvestTokens;
      pendingHarvest.lastHarvestedAt = item.lastHarvestedAt;
    }
    return pendingHarvest;
  } catch (err) {
    console.error(err);
    return pendingHarvest;
  }
}
