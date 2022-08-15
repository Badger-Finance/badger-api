import { Currency, VaultDTO, VaultPerformanceEvent } from "@badger-dao/sdk";
import { BigNumber } from "ethers";
import { HarvestCompoundData } from "../aws/models/harvest-compound.model";
import { VaultDefinitionModel } from "../aws/models/vault-definition.model";
import { YieldEstimate } from "../aws/models/yield-estimate.model";
import { YieldSource } from "../aws/models/yield-source.model";
import { Chain } from "../chains/config/chain.config";
import { TokenPrice } from "../prices/interface/token-price.interface";
import { Nullable } from "../utils/types.utils";
import { VaultHarvestData } from "./interfaces/vault-harvest-data.interface";
import { VaultHarvestsExtendedResp } from "./interfaces/vault-harvest-extended-resp.interface";
import { VaultStrategy } from "./interfaces/vault-strategy.interface";
export declare const VAULT_SOURCE = "Vault Compounding";
export declare function defaultVault(chain: Chain, vault: VaultDefinitionModel): Promise<VaultDTO>;
export declare function getCachedVault(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
  currency?: Currency
): Promise<VaultDTO>;
export declare function getStrategyInfo(chain: Chain, vault: VaultDefinitionModel): Promise<VaultStrategy>;
export declare function getBoostWeight(chain: Chain, vault: VaultDefinitionModel): Promise<BigNumber>;
/**
 * Get pricing information for a vault token.
 * @param chain Block chain instance
 * @param address Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
export declare function getVaultTokenPrice(chain: Chain, address: string): Promise<TokenPrice>;
/**
 * Load a Badger vault measured performance.
 * @param chain Chain vault is deployed on
 * @param vault Vault definition of requested vault
 * @returns Value source array describing vault performance
 */
export declare function getVaultPerformance(chain: Chain, vault: VaultDefinitionModel): Promise<YieldSource[]>;
export declare function loadVaultEventPerformances(chain: Chain, vault: VaultDefinitionModel): Promise<YieldSource[]>;
/**
 * Extrapolates a one-year APR for a given vault based on compounding and emissions based on $100 deposit.
 * @param compoundApr Base compound APR of vault
 * @param emissionApr Emission APR of the emitted vault
 * @param emissionCompoundApr Derivative compound APR of the tmitted vault
 * @returns Extraposedat one year APR given current yields continue
 */
export declare function estimateDerivativeEmission(
  compoundApr: number,
  emissionApr: number,
  emissionCompoundApr: number,
  compoundingStep?: number,
  emissionStep?: number
): number;
export declare function loadVaultGraphPerformances(chain: Chain, vault: VaultDefinitionModel): Promise<YieldSource[]>;
export declare function estimateHarvestEventApr(
  chain: Chain,
  token: VaultPerformanceEvent["token"],
  start: number,
  end: number,
  amount: VaultPerformanceEvent["amount"],
  balance: BigNumber
): Promise<number>;
export declare function estimateVaultPerformance(
  chain: Chain,
  vault: VaultDefinitionModel,
  data: VaultHarvestData[]
): Promise<YieldSource[]>;
export declare function queryYieldSources(vault: VaultDefinitionModel): Promise<YieldSource[]>;
export declare function queryYieldEstimate(vault: VaultDefinitionModel): Promise<YieldEstimate>;
export declare function getVaultHarvestsOnChain(
  chain: Chain,
  address: VaultDefinitionModel["address"],
  startFromBlock?: Nullable<number>
): Promise<VaultHarvestsExtendedResp[]>;
export declare function getLastCompoundHarvest(vault: string): Promise<Nullable<HarvestCompoundData>>;
