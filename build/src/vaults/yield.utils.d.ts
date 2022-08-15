import { VaultDTO, VaultYieldProjection } from "@badger-dao/sdk";
import { VaultDefinitionModel } from "../aws/models/vault-definition.model";
import { VaultPendingHarvestData } from "../aws/models/vault-pending-harvest.model";
import { YieldSources } from "./interfaces/yield-sources.interface";
/**
 *
 * @param vault
 * @returns
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
 * @param pendingHarvest vault harvest measurements
 * @returns evaluated vault yield projection
 */
export declare function getVaultYieldProjection(
  vault: VaultDTO,
  yieldSources: YieldSources,
  pendingHarvest: VaultPendingHarvestData
): VaultYieldProjection;
