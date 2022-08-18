import {
  formatBalance,
  gqlGenT,
  HarvestType,
  keyBy,
  Network,
  ONE_DAY_MS,
  ONE_DAY_SECONDS,
  ONE_YEAR_MS,
  TokenRate,
  TokenValue,
  ValueSource,
  Vault__factory,
  VaultDTO,
  VaultHarvestData,
  VaultState,
  VaultVersion,
  VaultYieldProjection,
} from '@badger-dao/sdk';
import { BigNumber, ethers } from 'ethers';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { queryPrice, queryPriceAtTimestamp } from '../prices/prices.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { BoostRange } from '../rewards/interfaces/boost-range.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { getFullToken } from '../tokens/tokens.utils';
import { getInfuelnceVaultYieldBalance, isInfluenceVault } from './influence.utils';
import { YieldSources } from './interfaces/yield-sources.interface';
import { estimateDerivativeEmission, queryYieldSources, VAULT_SOURCE } from './vaults.utils';

const VAULT_TWAY_PERIOD = 15;

/**
 * Determine if a yield source in relevant in a given context.
 * Only sources not stemming from a DAO action are considered relevant in discontinued state.
 * Only sources providing a material apr are considered relevant.
 * @param source yield source to validate
 * @param state state of the vault the yield source references
 * @returns true if the source is relevant, false if not
 */
function isRelevantSource(source: YieldSource, state: VaultState): boolean {
  if (source.apr < 0.001) {
    return false;
  }
  if (state === VaultState.Discontinued) {
    return isPassiveSource(source);
  }
  return true;
}

/**
 * Determine if a yield source is not associated with any harvest.
 * @param source yield source to validate
 * @returns true if source does not originate from any harvest, false if so
 */
function isPassiveSource(source: YieldSource): boolean {
  return isNonHarvestSource(source) && source.type !== SourceType.Flywheel;
}

/**
 * Determine if a yield source is not directly associated with a singular harvest.
 * @param source yield source to validate
 * @returns true if source does not originate directly from a singular harvest, false if so
 */
function isNonHarvestSource(source: YieldSource): boolean {
  return (
    source.type !== SourceType.Compound &&
    source.type !== SourceType.PreCompound &&
    source.type !== SourceType.Distribution
  );
}

/**
 * Determine if a yield source is an apr source.
 * Any source that is not part of a compounding yield is considered an apr source.
 * @param source yield source to validate
 * @returns true if source is not compounded
 */
function isAprSource(source: YieldSource): boolean {
  return source.type !== SourceType.Compound && source.type !== SourceType.Flywheel;
}

/**
 * Determine if a yield source is an apy source.
 * Any source that is not tied specifically no non compounding harvest yield is considered an apy source.
 * @param source yield source to validate
 * @returns true if source is compounded
 */
function isApySource(source: YieldSource): boolean {
  return source.type !== SourceType.PreCompound;
}

/**
 * Convert a token balance to a token rate given inputs.
 * @param balance balance to convert to token rate
 * @param principal principal amount given balance is referenced against
 * @param duration duration balance was accrued
 * @returns token rate representing the balance earned over a given duration
 */
function balanceToTokenRate(balance: CachedTokenBalance, principal: number, duration: number): TokenRate {
  const compoundingValue = balance.name === VAULT_SOURCE ? balance.value : 0;
  const apr = calculateYield(principal, balance.value, duration, compoundingValue);
  return {
    apr,
    ...balance,
  };
}

/**
 * Convert yield source to value source.
 * @param source yield source to be converted
 * @returns value source derived from yield source
 */
function yieldToValueSource(source: YieldSource): ValueSource {
  return {
    name: source.name,
    apr: source.apr,
    boostable: source.boostable,
    minApr: source.minApr,
    maxApr: source.maxApr,
  };
}

/**
 * Aggregate source by source name for readibility
 * @param sources source list to aggregate
 * @returns source list with all unique elements by name with aggregated values
 */
export function aggregateSources<T extends ValueSource>(
  sources: T[],
  accessor: (source: T) => string = (s) => s.name,
): T[] {
  const sourceMap: Record<string, T> = {};
  const sourcesCopy = JSON.parse(JSON.stringify(sources));
  for (const source of sourcesCopy) {
    if (!sourceMap[accessor(source)]) {
      sourceMap[accessor(source)] = source;
    } else {
      const { apr, minApr, maxApr } = source;
      sourceMap[accessor(source)].apr += apr;
      sourceMap[accessor(source)].minApr += minApr;
      sourceMap[accessor(source)].maxApr += maxApr;
    }
  }
  return Object.values(sourceMap);
}

/**
 * Calculate the yield for a given value earned over a set duration, with an optional amount being a compounded portion over that period.
 * @param principal base value
 * @param earned earned value
 * @param duration period of time in ms
 * @param compoundingValue compounded portion of base value
 * @returns apr or apy for given inputs, any value with compouned portions are apy
 */
export function calculateYield(principal: number, earned: number, duration: number, compoundingValue = 0): number {
  if (compoundingValue > earned) {
    throw new Error('Compounding value must be less than or equal to earned');
  }
  if (duration === 0 || principal === 0 || earned === 0) {
    return 0;
  }
  const periods = ONE_YEAR_MS / duration;
  const apr = (earned / principal) * periods * 100;
  if (compoundingValue === 0) {
    return apr;
  }
  const nonCompoundingValue = earned - compoundingValue;
  const nonCompoundingScalar = nonCompoundingValue / earned;
  let nonCompoundingApr = 0;
  if (nonCompoundingValue > 0) {
    const nonCompoundedEarned = earned * nonCompoundingScalar;
    nonCompoundingApr = (nonCompoundedEarned / principal) * periods;
  }
  const compoundingApr = ((earned * (1 - nonCompoundingScalar)) / principal) * periods;
  const compoundingApy = (1 + compoundingApr / periods) ** periods - 1;
  return (nonCompoundingApr + compoundingApy) * 100;
}

/**
 * Calculate the difference in two lists of tokens.
 * @param listA reference previous list
 * @param listB reference current list
 * @returns difference between previous and current list
 */
export function calculateBalanceDifference(listA: TokenValue[], listB: TokenValue[]): TokenValue[] {
  // we need to construct a measurement diff from the originally measured tokens and the new tokens
  const listAByToken = keyBy(listA, (t) => t.address);
  const listBCopy: CachedTokenBalance[] = JSON.parse(JSON.stringify(listB));

  listBCopy.forEach((t) => {
    const yieldedTokens = listAByToken.get(t.address);
    if (yieldedTokens) {
      // lock in current price and caculate value on updated balance
      for (const token of yieldedTokens) {
        const price = t.value / t.balance;
        t.balance -= token.balance;
        t.value = t.balance * price;
      }
    }
  });

  return listBCopy;
}

/**
 * Query and filter cached yield sources into respective categories
 * @param vault vault to query yield sources against
 * @returns categorized yield sources
 */
export async function getYieldSources(vault: VaultDefinitionModel): Promise<YieldSources> {
  const yieldSources = await queryYieldSources(vault);

  const relevantSources = yieldSources.filter((s) => isRelevantSource(s, vault.state));
  const sources = relevantSources.filter(isAprSource);
  const apr = sources.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);
  const sourcesApy = relevantSources.filter(isApySource);
  const apy = sourcesApy.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);
  const nonHarvestSources = sourcesApy.filter(isPassiveSource);
  const nonHarvestSourcesApy = sourcesApy.filter(isNonHarvestSource);

  const aggregatedSources = aggregateSources(sources.map(yieldToValueSource));
  const aggregatedSourcesApy = aggregateSources(sourcesApy.map(yieldToValueSource));
  const nonHarvestAggregatedSources = aggregateSources(nonHarvestSources.map(yieldToValueSource));
  const nonHarvestAggregatedSourcesApy = aggregateSources(nonHarvestSourcesApy.map(yieldToValueSource));

  return {
    apr,
    sources: aggregatedSources,
    apy,
    sourcesApy: aggregatedSourcesApy,
    nonHarvestSources: nonHarvestAggregatedSources,
    nonHarvestSourcesApy: nonHarvestAggregatedSourcesApy,
  };
}

/**
 * Evalauate the projected vault yield in a multitude of ways.
 * - Evaluates the previous yield measurement period performance
 * - Evaluates the previous harvest measurement performance
 * The yield measuremeant is a most update data differential reward measurement between
 * measurement intervals. This is the closest to spot APR any system can come.
 * The harvest measurement is the truer APR being realized during the overall harvest.
 * This value may be lower than spot due to fluctuating reward values during measurement or
 * harvest periods.
 * @param vault vault requested for projection
 * @param yieldEstimate vault harvest measurements
 * @returns evaluated vault yield projection
 */
export function getVaultYieldProjection(
  vault: VaultDTO,
  yieldSources: YieldSources,
  yieldEstimate: YieldEstimate,
): VaultYieldProjection {
  const { value, balance, available, lastHarvest } = vault;
  const { nonHarvestSources, nonHarvestSourcesApy } = yieldSources;
  const {
    yieldTokens,
    previousYieldTokens,
    harvestTokens,
    previousHarvestTokens,
    duration: periodDuration,
  } = yieldEstimate;

  const yieldTokensCurrent = calculateBalanceDifference(previousYieldTokens, yieldTokens);
  const harvestTokensCurrent = calculateBalanceDifference(previousHarvestTokens, harvestTokens);

  // calculate the overall harvest values
  const harvestValue = harvestTokens.reduce((total, token) => (total += token.value), 0);
  const yieldValue = yieldTokens.reduce((total, token) => (total += token.value), 0);
  const harvestDuration = Date.now() - lastHarvest;

  // calculate the current measurement periods values
  const harvestValuePerPeriod = harvestTokensCurrent.reduce((total, token) => (total += token.value), 0);
  const yieldValuePerPeriod = yieldTokensCurrent.reduce((total, token) => (total += token.value), 0);
  const harvestCompoundValuePerPeriod = harvestTokensCurrent
    .filter((t) => vault.underlyingToken === t.address)
    .reduce((total, token) => (total += token.value), 0);

  const earningValue = balance > 0 ? value * ((balance - available) / balance) : 0;
  const nonHarvestApr = nonHarvestSources.reduce((total, token) => (total += token.apr), 0);
  const nonHarvestApy = nonHarvestSourcesApy.reduce((total, token) => (total += token.apr), 0);

  return {
    harvestValue,
    harvestApr: calculateYield(earningValue, harvestValue, harvestDuration),
    harvestPeriodApr: calculateYield(earningValue, harvestValuePerPeriod, periodDuration),
    harvestPeriodApy: calculateYield(
      earningValue,
      harvestValuePerPeriod,
      periodDuration,
      harvestCompoundValuePerPeriod,
    ),
    harvestTokens: harvestTokens.map((t) => balanceToTokenRate(t, earningValue, harvestDuration)),
    harvestPeriodSources: harvestTokensCurrent.map((t) => balanceToTokenRate(t, earningValue, periodDuration)),
    harvestPeriodSourcesApy: harvestTokensCurrent.map((t) => balanceToTokenRate(t, earningValue, periodDuration)),
    yieldValue,
    yieldApr: calculateYield(earningValue, yieldValue, harvestDuration),
    yieldTokens: yieldTokens.map((t) => balanceToTokenRate(t, earningValue, harvestDuration)),
    yieldPeriodApr: calculateYield(earningValue, yieldValuePerPeriod, periodDuration),
    yieldPeriodSources: yieldTokensCurrent.map((t) => balanceToTokenRate(t, earningValue, periodDuration)),
    nonHarvestApr,
    nonHarvestSources,
    nonHarvestApy,
    nonHarvestSourcesApy,
  };
}

/**
 *
 * @param vault
 * @param type
 * @param name
 * @param apr
 * @param param4
 * @returns
 */
export function createYieldSource(
  vault: VaultDefinitionModel,
  type: SourceType,
  name: string,
  apr: number,
  { min, max }: BoostRange = { min: 1, max: 1 },
): YieldSource {
  const { id: vaultId, address, chain } = vault;
  const isBoostable = min != max;
  const boostModifier = isBoostable ? 'Boosted' : 'Flat';
  const id = [vaultId, type, name, boostModifier].map((p) => p.replace(/ /g, '_').toLowerCase()).join('_');
  return Object.assign(new YieldSource(), {
    id,
    chainAddress: vaultId,
    chain,
    address,
    type,
    name,
    apr,
    boostable: isBoostable,
    minApr: apr * min,
    maxApr: apr * max,
  });
}

export async function loadVaultEventPerformances(chain: Chain, vault: VaultDefinitionModel): Promise<YieldSource[]> {
  const incompatibleNetworks = new Set<Network>([Network.BinanceSmartChain, Network.Polygon, Network.Arbitrum]);
  if (incompatibleNetworks.has(chain.network)) {
    throw new Error('Network does not have standardized vaults!');
  }

  if (isInfluenceVault(vault.address)) {
    throw new Error('Vault utilizes external harvest processor, not compatible with event lookup');
  }

  const sdk = await chain.getSdk();
  const cutoffPeriod = VAULT_TWAY_PERIOD * ONE_DAY_SECONDS;
  const cutoff = Date.now() / 1000 - cutoffPeriod;
  const startBlock = (await sdk.provider.getBlockNumber()) - Math.floor(cutoffPeriod / 13);
  const { data } = await sdk.vaults.listHarvests({
    address: vault.address,
    timestamp_gte: cutoff,
    version: vault.version ?? VaultVersion.v1,
    startBlock,
  });

  return estimateVaultPerformance(chain, vault, data);
}

export async function loadVaultGraphPerformances(chain: Chain, vault: VaultDefinitionModel): Promise<YieldSource[]> {
  const sdk = await chain.getSdk();
  const { graph } = sdk;
  const { address } = vault;

  const now = Math.floor(Date.now() / 1000);
  const cutoff = Math.floor(now - VAULT_TWAY_PERIOD * ONE_DAY_SECONDS);

  const [vaultHarvests, treeDistributions] = await Promise.all([
    graph.loadSettHarvests({
      where: {
        sett: address.toLowerCase(),
        timestamp_gte: cutoff,
      },
    }),
    graph.loadBadgerTreeDistributions({
      where: {
        sett: address.toLowerCase(),
        timestamp_gte: cutoff,
      },
    }),
  ]);

  const { settHarvests } = vaultHarvests;
  const { badgerTreeDistributions } = treeDistributions;
  const data = constructGraphVaultData(vault, settHarvests, badgerTreeDistributions);
  return estimateVaultPerformance(chain, vault, data);
}

function constructGraphVaultData(
  vault: VaultDefinitionModel,
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
        token: vault.depositToken,
        amount: h.amount,
      })),
      treeDistributions: currentDistributions.map((d) => {
        const tokenAddress = d.token.id.startsWith('0x0x') ? d.token.id.slice(2) : d.token.id;
        return {
          timestamp,
          block: Number(d.blockNumber),
          token: tokenAddress,
          amount: d.amount,
        };
      }),
    };
  });
}

export async function estimateVaultPerformance(
  chain: Chain,
  vault: VaultDefinitionModel,
  data: VaultHarvestData[],
): Promise<YieldSource[]> {
  if (data.length === 0) {
    return [];
  }

  const sdk = await chain.getSdk();
  const recentHarvests = data.sort((a, b) => b.timestamp - a.timestamp);

  /**
   * ON 8/15 AN INCORREC PROCESSING OF A BADGER REWARDS PROCESSOR OCCURED.
   * AS A RESULT, THE EVENTS INCLUDED IN TREE DISTRIBUTIONS DID NOT MAKE IT
   * TO THE GRAPH, OR ANY SOURCE OF ON CHAIN DATA CURRENTLY SUPPORTED BY
   * THE CURRENT YIELD SYSTEM.
   *
   * https://etherscan.io/tx/0x1e3e7c71012d36e936b768a37e9784125a00f205a22bd808f045968a506bb1ce#eventlog
   *
   * THIS TRANSACTION CONTAINS THE SINGLE BADGER TREE DISTRIBUTION WE ARE
   * ALLOCATING TO GRAVI_AURA VAULT AS A MISSED - AND NOT CAPTURED SOURCE.
   *
   * THIS CODE SHOULD BE REMOVED BY 08/29.
   */
  if (vault.address === TOKENS.GRAVI_AURA) {
    const targetBlock = 15344809;
    const block = await sdk.provider.getBlock(targetBlock);
    const targetedInsertion = recentHarvests[0].treeDistributions;
    targetedInsertion.push({
      timestamp: block.timestamp,
      block: targetBlock,
      token: TOKENS.BADGER,
      amount: BigNumber.from('1928771715566995688546'),
    });
  }

  const allHarvests = recentHarvests.flatMap((h) => h.harvests.map((h) => ({ ...h, type: HarvestType.Harvest })));
  const allDistributions = recentHarvests.flatMap((h) =>
    h.treeDistributions.map((d) => ({ ...d, type: HarvestType.TreeDistribution })),
  );
  const allEvents = allHarvests
    .concat(allDistributions)
    .filter((e) => BigNumber.from(e.amount).gt(ethers.constants.Zero))
    .sort((a, b) => b.timestamp - a.timestamp);

  let harvestReport = `${vault.name} Harvest Report\n`;

  let totalHarvested = 0;
  let totalAccumulated = 0;
  let totalVaultTokens = 0;
  let totalVaultPrincipal = 0;

  console.log(`Evaluating ${allEvents.length} events for ${vault.name}`);
  for (const event of allEvents) {
    const token = await getFullToken(chain, event.token);
    const amount = formatBalance(event.amount, token.decimals);
    const { price } = await queryPriceAtTimestamp(token.address, event.timestamp * 1000);

    const tokenEarned = price * amount;
    totalAccumulated += tokenEarned;
    if (event.type === HarvestType.Harvest) {
      totalHarvested += amount;
    }

    let balance = 0;
    if (isInfluenceVault(vault.address)) {
      balance = await getInfuelnceVaultYieldBalance(chain, vault.address, event.block);
    } else {
      const vaultContract = Vault__factory.connect(vault.address, sdk.provider);
      const totalSupply = await vaultContract.totalSupply({ blockTag: event.block });
      balance = formatBalance(totalSupply);
    }
    const { price: vaultPrice } = await queryPriceAtTimestamp(vault.address, event.timestamp * 1000);
    totalVaultTokens += balance;
    totalVaultPrincipal += vaultPrice * balance;

    harvestReport = harvestReport.concat(
      `[${new Date(event.timestamp * 1000).toDateString()}] ${amount.toFixed(2)} ${
        token.symbol
      } ($${tokenEarned.toFixed(2)}) - Balance: ${balance.toFixed(2)}\n`,
    );
  }

  const duration = VAULT_TWAY_PERIOD * ONE_DAY_MS;
  const averagePrincipal = totalVaultPrincipal / allEvents.length;
  const averageTokens = totalVaultTokens / allEvents.length;
  const apr = calculateYield(averagePrincipal, totalAccumulated, duration);
  harvestReport = harvestReport.concat(
    `Vault Holdings: $${averagePrincipal.toFixed()} (${averageTokens.toFixed()} tokens), Total Earned: $${totalAccumulated.toFixed(
      2,
    )}, Est. Yield: ${apr.toFixed(2)}%`,
  );
  console.log(harvestReport);

  const valueSources = [];

  // create the apr source for harvests
  const compoundApr = calculateYield(totalVaultTokens, totalHarvested, duration);
  const compoundYieldSource = createYieldSource(vault, SourceType.PreCompound, VAULT_SOURCE, compoundApr);
  valueSources.push(compoundYieldSource);

  // create the apy source for harvests
  const compoundApy = calculateYield(totalVaultTokens, totalHarvested, duration, totalHarvested);
  const compoundedYieldSource = createYieldSource(vault, SourceType.Compound, VAULT_SOURCE, compoundApy);
  valueSources.push(compoundedYieldSource);

  const tokensEmitted = new Map<string, BigNumber>();
  for (const distribution of allDistributions) {
    const { token, amount } = distribution;
    let entry = tokensEmitted.get(token);
    if (!entry) {
      entry = BigNumber.from(0);
      tokensEmitted.set(token, entry);
    }
    tokensEmitted.set(token, entry.add(amount));
  }

  let flywheelCompounding = 0;

  for (const [token, amount] of tokensEmitted.entries()) {
    const { price } = await queryPrice(token);
    const tokenEmitted = await getFullToken(chain, token);
    const tokensEmitted = formatBalance(amount, tokenEmitted.decimals);
    const valueEmitted = tokensEmitted * price;
    const emissionApr = calculateYield(averagePrincipal, valueEmitted, duration);
    const emissionYieldSource = createYieldSource(vault, SourceType.Distribution, tokenEmitted.name, emissionApr);
    valueSources.push(emissionYieldSource);

    // try to add underlying emitted vault value sources if applicable
    try {
      const emittedVault = await chain.vaults.getVault(tokenEmitted.address);
      const vaultValueSources = await queryYieldSources(emittedVault);
      // search for the persisted apr variant of the compounding vault source, if any
      const compoundingSource = vaultValueSources.find((source) => source.type === SourceType.PreCompound);
      if (compoundingSource) {
        flywheelCompounding += estimateDerivativeEmission(compoundApr, emissionApr, compoundingSource.apr / 100);
      }
    } catch {} // ignore error for non vaults
  }

  if (flywheelCompounding > 0) {
    const sourceName = `Vault Flywheel`;
    const flywheelYieldSource = createYieldSource(vault, SourceType.Flywheel, sourceName, flywheelCompounding);
    valueSources.push(flywheelYieldSource);
  }

  return valueSources;
}
