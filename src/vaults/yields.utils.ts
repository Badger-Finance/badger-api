import {
  keyBy,
  ONE_YEAR_MS,
  TokenRate,
  TokenValue,
  ValueSource,
  VaultDTO,
  VaultState,
  VaultYieldProjection,
} from '@badger-dao/sdk';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { SourceType } from '../rewards/enums/source-type.enum';
import { BoostRange } from '../rewards/interfaces/boost-range.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { YieldSources } from './interfaces/yield-sources.interface';
import { queryYieldSources, VAULT_SOURCE } from './vaults.utils';

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
  const compoundingValue = balance.name === VAULT_SOURCE ? principal : 0;
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
  if (compoundingValue > principal) {
    throw new Error('Compounding value must be less than or equal to principal');
  }
  if (duration === 0 || principal === 0 || earned === 0) {
    return 0;
  }
  const periods = ONE_YEAR_MS / duration;
  const apr = (earned / principal) * periods * 100;
  if (compoundingValue === 0) {
    return apr;
  }
  const nonCompoundingValue = principal - compoundingValue;
  const nonCompoundingScalar = nonCompoundingValue / principal;
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
