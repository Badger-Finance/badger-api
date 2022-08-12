import { TokenValue, ValueSource, VaultDTO, VaultYieldProjection } from '@badger-dao/sdk';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { SourceType } from '../rewards/enums/source-type.enum';
import { BoostRange } from '../rewards/interfaces/boost-range.interface';
import { YieldSources } from './interfaces/yield-sources.interface';
/**
 * Aggregate source by source name for readibility
 * @param sources source list to aggregate
 * @returns source list with all unique elements by name with aggregated values
 */
export declare function aggregateSources<T extends ValueSource>(sources: T[], accessor?: (source: T) => string): T[];
/**
 * Calculate the yield for a given value earned over a set duration, with an optional amount being a compounded portion over that period.
 * @param principal base value
 * @param earned earned value
 * @param duration period of time in ms
 * @param compoundingValue compounded portion of base value
 * @returns apr or apy for given inputs, any value with compouned portions are apy
 */
export declare function calculateYield(principal: number, earned: number, duration: number, compoundingValue?: number): number;
/**
 * Calculate the difference in two lists of tokens.
 * @param listA reference previous list
 * @param listB reference current list
 * @returns difference between previous and current list
 */
export declare function calculateBalanceDifference(listA: TokenValue[], listB: TokenValue[]): TokenValue[];
/**
 * Query and filter cached yield sources into respective categories
 * @param vault vault to query yield sources against
 * @returns categorized yield sources
 */
export declare function getYieldSources(vault: VaultDefinitionModel): Promise<YieldSources>;
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
export declare function getVaultYieldProjection(vault: VaultDTO, yieldSources: YieldSources, yieldEstimate: YieldEstimate): VaultYieldProjection;
/**
 *
 * @param vault
 * @param type
 * @param name
 * @param apr
 * @param param4
 * @returns
 */
export declare function createYieldSource(vault: VaultDefinitionModel, type: SourceType, name: string, apr: number, { min, max }?: BoostRange): YieldSource;
