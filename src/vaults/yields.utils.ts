import {
  ONE_DAY_MS,
  ONE_YEAR_MS,
  TokenRate,
  ValueSource,
  VaultDTO,
  VaultState,
  VaultYieldProjectionV3,
  YieldSource,
  YieldType,
} from '@badger-dao/sdk';

import { CachedTokenBalance } from '../aws/models/cached-token-balance.interface';
import { CachedYieldSource } from '../aws/models/cached-yield-source.interface';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { Chain } from '../chains/config/chain.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { BoostRange } from '../rewards/interfaces/boost-range.interface';
import { calculateBalanceDifference, getFullToken, getFullTokens } from '../tokens/tokens.utils';
import { queryVaultYieldEvents } from './harvests.utils';
import { filterPerformanceItems } from './influence.utils';
import { VaultYieldEvaluation } from './interfaces/vault-yield-evaluation.interface';
import { YieldSources } from './interfaces/yield-sources.interface';
import { VaultEmissionData } from './types/vault-emission-data';
import { VAULT_SOURCE, VAULT_TWAY_DURATION } from './vaults.config';
import { estimateDerivativeEmission, queryYieldSources } from './vaults.utils';

/**
 * Determine if a yield source in relevant in a given context.
 * Only sources not stemming from a DAO action are considered relevant in discontinued state.
 * Only sources providing a material apr are considered relevant.
 * @param source yield source to validate
 * @param state state of the vault the yield source references
 * @returns true if the source is relevant, false if not
 */
function isRelevantSource(source: CachedYieldSource, state: VaultState): boolean {
  const { baseYield } = source.performance;
  if (baseYield < 0.001) {
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
function isPassiveSource(source: CachedYieldSource): boolean {
  return isNonHarvestSource(source) && source.type !== SourceType.Flywheel;
}

/**
 * Determine if a yield source is not directly associated with a singular harvest.
 * @param source yield source to validate
 * @returns true if source does not originate directly from a singular harvest, false if so
 */
function isNonHarvestSource(source: CachedYieldSource): boolean {
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
function isAprSource(source: CachedYieldSource): boolean {
  return source.type !== SourceType.Compound && source.type !== SourceType.Flywheel;
}

/**
 * Determine if a yield source is an apy source.
 * Any source that is not tied specifically no non compounding harvest yield is considered an apy source.
 * @param source yield source to validate
 * @returns true if source is compounded
 */
function isApySource(source: CachedYieldSource): boolean {
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
export function yieldToValueSource(source: YieldSource): ValueSource {
  const { baseYield, minYield, maxYield } = source.performance;
  return {
    name: source.name,
    apr: baseYield,
    boostable: source.boostable,
    minApr: minYield,
    maxApr: maxYield,
  };
}

/**
 * Aggregate source by source name for readibility
 * @param sources source list to aggregate
 * @returns source list with all unique elements by name with aggregated values
 */
export function aggregateSources<T extends YieldSource>(
  sources: T[],
  accessor: (source: T) => string = (s) => s.name,
): T[] {
  const sourceMap: Record<string, T> = {};
  const sourcesCopy: T[] = JSON.parse(JSON.stringify(sources));
  for (const source of sourcesCopy) {
    if (!sourceMap[accessor(source)]) {
      sourceMap[accessor(source)] = source;
    } else {
      const {
        performance: { baseYield, minYield, maxYield },
      } = source;
      const existingSource = sourceMap[accessor(source)];
      existingSource.performance.baseYield += baseYield;
      existingSource.performance.minYield += minYield;
      existingSource.performance.maxYield += maxYield;
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
 * Query and filter cached yield sources into respective categories
 * @param vault vault to query yield sources against
 * @returns categorized yield sources
 */
export async function getYieldSources(vault: VaultDefinitionModel): Promise<YieldSources> {
  const yieldSources = await queryYieldSources(vault);

  const relevantSources = yieldSources.filter((s) => isRelevantSource(s, vault.state));
  const sources = relevantSources.filter(isAprSource);
  const sourcesApy = relevantSources.filter(isApySource);
  const nonHarvestSources = sourcesApy.filter(isPassiveSource);
  const nonHarvestSourcesApy = sourcesApy.filter(isNonHarvestSource);

  const sum = (total: number, apr: number) => (total += apr);
  const apr = sources.map((s) => s.performance.baseYield).reduce(sum, 0);
  const minApr = sources.map((s) => s.performance.minYield).reduce(sum, 0);
  const maxApr = sources.map((s) => s.performance.maxYield).reduce(sum, 0);
  const grossApr = sources.map((s) => s.performance.grossYield).reduce(sum, 0);
  const minGrossApr = sources.map((s) => s.performance.minGrossYield).reduce(sum, 0);
  const maxGrossApr = sources.map((s) => s.performance.maxGrossYield).reduce(sum, 0);

  const apy = sourcesApy.map((s) => s.performance.baseYield).reduce(sum, 0);
  const minApy = sourcesApy.map((s) => s.performance.minYield).reduce(sum, 0);
  const maxApy = sourcesApy.map((s) => s.performance.maxYield).reduce(sum, 0);
  const grossApy = sourcesApy.map((s) => s.performance.grossYield).reduce(sum, 0);
  const minGrossApy = sourcesApy.map((s) => s.performance.minGrossYield).reduce(sum, 0);
  const maxGrossApy = sourcesApy.map((s) => s.performance.maxGrossYield).reduce(sum, 0);

  const aggregatedSources = aggregateSources(sources);
  const aggregatedSourcesApy = aggregateSources(sourcesApy);
  const nonHarvestAggregatedSources = aggregateSources(nonHarvestSources);
  const nonHarvestAggregatedSourcesApy = aggregateSources(nonHarvestSourcesApy);

  return {
    apr: {
      baseYield: apr,
      minYield: minApr,
      maxYield: maxApr,
      grossYield: grossApr,
      minGrossYield: minGrossApr,
      maxGrossYield: maxGrossApr,
      sources: aggregatedSources,
    },
    apy: {
      baseYield: apy,
      minYield: minApy,
      maxYield: maxApy,
      grossYield: grossApy,
      minGrossYield: minGrossApy,
      maxGrossYield: maxGrossApy,
      sources: aggregatedSourcesApy,
    },
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
): VaultYieldProjectionV3 {
  const { value, balance, available } = vault;
  const { nonHarvestSources, nonHarvestSourcesApy } = yieldSources;
  const {
    yieldTokens,
    previousYieldTokens,
    harvestTokens,
    previousHarvestTokens,
    duration: periodDuration,
    lastHarvestedAt,
  } = yieldEstimate;

  const yieldTokensCurrent = calculateBalanceDifference(previousYieldTokens, yieldTokens);
  const harvestTokensCurrent = calculateBalanceDifference(previousHarvestTokens, harvestTokens);

  // calculate the overall harvest values
  const harvestValue = harvestTokens.reduce((total, token) => (total += token.value), 0);
  const yieldValue = yieldTokens.reduce((total, token) => (total += token.value), 0);
  const harvestDuration = Date.now() - lastHarvestedAt;

  // calculate the current measurement periods values
  const harvestValuePerPeriod = harvestTokensCurrent.reduce((total, token) => (total += token.value), 0);
  const yieldValuePerPeriod = yieldTokensCurrent.reduce((total, token) => (total += token.value), 0);
  const harvestCompoundValuePerPeriod = harvestTokensCurrent
    .filter((t) => vault.underlyingToken === t.address)
    .reduce((total, token) => (total += token.value), 0);

  const earningValue = balance > 0 ? value * ((balance - available) / balance) : 0;
  const nonHarvestApr = nonHarvestSources.reduce((total, source) => (total += source.performance.baseYield), 0);
  const nonHarvestApy = nonHarvestSourcesApy.reduce((total, source) => (total += source.performance.baseYield), 0);

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
 * Create a yield source for a given vault.
 * @param vault vault associated with yield
 * @param type source type of the reported yeild
 * @param name display name for the yield
 * @param apr performance of the vault
 * @param boost optional boost params for the yield source
 * @returns collision resistant yield source with boost support
 */
export function createYieldSource(
  vault: VaultDefinitionModel,
  type: SourceType,
  name: string,
  apr: number,
  grossApr: number = apr,
  boost: BoostRange = { min: 1, max: 1 },
): CachedYieldSource {
  const { id: vaultId, chain, address } = vault;
  const { min, max } = boost;
  const isBoostable = min != max;
  const boostModifier = isBoostable ? 'Boosted' : 'Flat';
  const id = [vaultId, type, name, boostModifier].map((p) => p.replace(/ /g, '_').toLowerCase()).join('_');
  const yieldSource: CachedYieldSource = {
    address,
    id,
    chainAddress: vaultId,
    chain,
    type,
    name,
    performance: {
      baseYield: apr,
      minYield: apr * min,
      maxYield: apr * max,
      grossYield: grossApr,
      minGrossYield: grossApr * min,
      maxGrossYield: grossApr * max,
    },
    boostable: isBoostable,
  };
  return Object.assign(new CachedYieldSource(), yieldSource);
}

/**
 * Constructs yield sources from collected emission apr for a given vault.
 * @param chain network vault is deployed on
 * @param vault vault requesting yield sources
 * @param compoundApr baseline compound apr associated with the vault
 * @param tokenAprs tre distribution cumulative aprs
 * @returns yield sources for all captured tokens including any flywheel effects
 */
async function constructEmissionYieldSources(
  chain: Chain,
  vault: VaultDefinitionModel,
  compoundApr: number,
  tokenAprs: VaultEmissionData,
): Promise<CachedYieldSource[]> {
  const valueSources = [];

  let flywheelCompounding = 0;

  for (const [token, { baseYield, grossYield }] of tokenAprs.entries()) {
    const tokenEmitted = await getFullToken(chain, token);
    const emissionYieldSource = createYieldSource(
      vault,
      SourceType.Distribution,
      tokenEmitted.name,
      baseYield,
      grossYield,
    );
    valueSources.push(emissionYieldSource);

    // try to add underlying emitted vault value sources if applicable
    try {
      const emittedVault = await chain.vaults.getVault(tokenEmitted.address);
      const vaultValueSources = await queryYieldSources(emittedVault);
      // search for the persisted apr variant of the compounding vault source, if any
      const compoundingSource = vaultValueSources.find((source) => source.type === SourceType.PreCompound);
      if (compoundingSource) {
        const compoundingApr = compoundingSource.performance.baseYield;
        flywheelCompounding += estimateDerivativeEmission(compoundApr / 100, baseYield / 100, compoundingApr / 100);
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

/**
 * Evaluate yield events to derivate base apr, and apy as well as apr of any emitted tokens.
 * @param chain network the vault is deployed on
 * @param vault vault requested yield event evaluation
 * @param yieldEvents events sourced from either on chain or the graph
 * @returns yield summary providing the base information for construction of yield sources
 */
async function evaluateYieldEvents(chain: Chain, vault: VaultDefinitionModel): Promise<VaultYieldEvaluation> {
  const yieldEvents = await queryVaultYieldEvents(chain, vault);

  // this error should bubble up to yield source persistence
  // from a practical perspective this is here to allow vaults to retain calculated yield if there is no history
  // this is primary needed for a clean resync of harvest data without impacting 'synced' data
  if (vault.state !== VaultState.Discontinued && yieldEvents.length === 0) {
    throw new Error(`${vault.name} has no recent harvests, it is either not synced, or effectively deprecated`);
  }

  const relevantYieldEvents = filterPerformanceItems(vault, yieldEvents);
  const tokenEmissionAprs: VaultEmissionData = new Map();

  let compoundApr = 0;
  for (const event of relevantYieldEvents) {
    const { token, apr, grossApr } = event;
    if (event.type === YieldType.Harvest) {
      compoundApr += apr;
    } else {
      const entry = tokenEmissionAprs.get(token) ?? { baseYield: 0, grossYield: 0 };
      tokenEmissionAprs.set(token, { baseYield: entry.baseYield + apr, grossYield: entry.grossYield + grossApr });
    }
  }

  const periods = ONE_YEAR_MS / VAULT_TWAY_DURATION;
  const compoundApy = ((1 + compoundApr / 100 / periods) ** periods - 1) * 100;
  const earnedTokens = new Set(yieldEvents.map((y) => y.token));
  const earnedTokensInfo = await getFullTokens(chain, Array.from(earnedTokens));

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  console.log(`\n${vault.name} Harvest Report`);
  console.table(
    relevantYieldEvents.map((r) => ({
      date: new Date(r.timestamp).toLocaleDateString(),
      type: r.type,
      token: earnedTokensInfo[r.token].symbol,
      amount: r.amount.toLocaleString(),
      earned: formatter.format(r.earned),
      apr: `${r.apr.toFixed(2)}%`,
      grossApr: `${r.grossApr.toFixed(2)}%`,
      duration: `${r.duration / ONE_DAY_MS} days`,
      vault_balance: r.balance.toLocaleString(),
      vault_principal: formatter.format(r.value),
    })),
  );
  const aggregateApr = relevantYieldEvents.reduce((total, report) => (total += report.apr), 0);
  const aggregateGrossApr = relevantYieldEvents.reduce((total, report) => (total += report.grossApr), 0);
  console.log(`${vault.name}: ${aggregateApr.toFixed(2)}% (gross: ${aggregateGrossApr.toFixed(2)}%)`);

  return {
    compoundApr,
    compoundApy,
    tokenEmissionAprs,
  };
}

/**
 * Estimate the event based APR of a given vault.
 * @param chain network vault is deployed on
 * @param vault vault requesting apr estimation
 * @param data harvest and tree distribution event information
 * @returns yield sources estimating the aggregate performance
 */
export async function queryVaultYieldSources(chain: Chain, vault: VaultDefinitionModel): Promise<CachedYieldSource[]> {
  const { compoundApr, compoundApy, tokenEmissionAprs } = await evaluateYieldEvents(chain, vault);

  const compoundSources = [];

  if (compoundApr > 0) {
    // create the apr source for harvests
    const compoundYieldSource = createYieldSource(vault, SourceType.PreCompound, VAULT_SOURCE, compoundApr);
    compoundSources.push(compoundYieldSource);

    // create the apy source for harvests
    const compoundedYieldSource = createYieldSource(vault, SourceType.Compound, VAULT_SOURCE, compoundApy);
    compoundSources.push(compoundedYieldSource);
  }

  const emissionSources = await constructEmissionYieldSources(chain, vault, compoundApr, tokenEmissionAprs);
  return compoundSources.concat(emissionSources);
}
