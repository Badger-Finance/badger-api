import { keyBy, ONE_YEAR_MS, TokenRate, VaultDTO, VaultState, VaultYieldProjection } from '@badger-dao/sdk';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultPendingHarvestData } from '../aws/models/vault-pending-harvest.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { SourceType } from '../rewards/enums/source-type.enum';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { YieldSources } from './interfaces/yield-sources.interface';
import { queryYieldSources } from './vaults.utils';

function isRelevantSource(source: YieldSource, state: VaultState): boolean {
  if (source.apr < 0.001) {
    return false;
  }
  if (state === VaultState.Discontinued) {
    return isPassiveSource(source);
  }
  return false;
}

function isPassiveSource(source: YieldSource): boolean {
  return !(isAprSource(source) || isApySource(source));
}

function isNonHarvestSource(source: YieldSource): boolean {
  return source.type !== SourceType.Compound && source.type !== SourceType.PreCompound;
}

function isAprSource(source: YieldSource): boolean {
  return source.type !== SourceType.Compound && source.type !== SourceType.Flywheel;
}

function isApySource(source: YieldSource): boolean {
  return source.type !== SourceType.PreCompound;
}

function balanceToTokenRate(balance: CachedTokenBalance, principal: number, duration: number): TokenRate {
  const apr = calculateProjectedYield(principal, balance.value, duration);
  return {
    apr,
    ...balance,
  };
}

function calculateProjectedYield(value: number, pendingValue: number, duration: number, compoundingValue = 0): number {
  if (duration === 0 || value === 0 || pendingValue === 0) {
    return 0;
  }
  const apr = (pendingValue / value) * (ONE_YEAR_MS / duration) * 100;
  if (compoundingValue === 0) {
    return apr;
  }
  const compoundingApr = (compoundingValue / value) * (ONE_YEAR_MS / duration);
  const periods = ONE_YEAR_MS / duration;
  return apr - compoundingApr + ((1 + compoundingApr / periods) ** periods - 1) * 100;
}

function calculateBalanceDifference(listA: CachedTokenBalance[], listB: CachedTokenBalance[]): CachedTokenBalance[] {
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
 *
 * @param vault
 * @returns
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
  return {
    apr,
    sources,
    apy,
    sourcesApy,
    nonHarvestSources,
    nonHarvestSourcesApy,
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
 * @param pendingHarvest vault harvest measurements
 * @returns evaluated vault yield projection
 */
export function getVaultYieldProjection(
  vault: VaultDTO,
  yieldSources: YieldSources,
  pendingHarvest: VaultPendingHarvestData,
): VaultYieldProjection {
  const { value, balance, available, lastHarvest } = vault;
  const { nonHarvestSources, nonHarvestSourcesApy } = yieldSources;
  const {
    yieldTokens,
    previousYieldTokens,
    harvestTokens,
    previousHarvestTokens,
    duration: periodDuration,
  } = pendingHarvest;

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
    harvestApr: calculateProjectedYield(earningValue, harvestValue, harvestDuration),
    harvestPeriodApr: calculateProjectedYield(earningValue, harvestValuePerPeriod, periodDuration),
    harvestPeriodApy: calculateProjectedYield(
      earningValue,
      harvestValuePerPeriod,
      periodDuration,
      harvestCompoundValuePerPeriod,
    ),
    harvestTokens: harvestTokens.map((t) => balanceToTokenRate(t, earningValue, harvestDuration)),
    harvestPeriodSources: harvestTokensCurrent.map((t) => balanceToTokenRate(t, earningValue, periodDuration)),
    // TODO: ensure vault token harvests receive apy maths
    harvestPeriodSourcesApy: harvestTokensCurrent.map((t) => balanceToTokenRate(t, earningValue, periodDuration)),
    yieldValue,
    yieldApr: calculateProjectedYield(earningValue, yieldValue, harvestDuration),
    yieldTokens: yieldTokens.map((t) => balanceToTokenRate(t, earningValue, harvestDuration)),
    yieldPeriodApr: calculateProjectedYield(earningValue, yieldValuePerPeriod, periodDuration),
    yieldPeriodSources: yieldTokensCurrent.map((t) => balanceToTokenRate(t, earningValue, periodDuration)),
    nonHarvestApr,
    nonHarvestSources,
    nonHarvestApy,
    nonHarvestSourcesApy,
  };
}
