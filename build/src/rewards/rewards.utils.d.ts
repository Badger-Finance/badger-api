import { BigNumber } from "ethers";
import { VaultDefinitionModel } from "../aws/models/vault-definition.model";
import { YieldSource } from "../aws/models/yield-source.model";
import { Chain } from "../chains/config/chain.config";
import { RewardMerkleDistribution } from "./interfaces/merkle-distributor.interface";
export declare const DIGG_SHARE_PER_FRAGMENT = "222256308823765331027878635805365830922307440079959220679625904457";
export declare function getTreeDistribution(chain: Chain): Promise<RewardMerkleDistribution | null>;
export declare function getClaimableRewards(
  chain: Chain,
  chainUsers: string[],
  distribution: RewardMerkleDistribution,
  blockNumber: number
): Promise<[string, [string[], BigNumber[]]][]>;
export declare function getRewardEmission(chain: Chain, vault: VaultDefinitionModel): Promise<YieldSource[]>;
export declare function getVaultValueSources(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel
): Promise<YieldSource[]>;
export declare function getProtocolValueSources(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel
): Promise<YieldSource[]>;
