import {
  BoostConfig,
  Protocol,
  TokenValue,
  ValueSource,
  VaultBehavior,
  VaultDTO,
  VaultState,
  VaultType,
  VaultVersion
} from "@badger-dao/sdk";
import { VaultYieldProjection } from "@badger-dao/sdk/lib/api/interfaces/vault-yield-projection.interface";
import { BouncerType } from "../../rewards/enums/bouncer-type.enum";
import { VaultStrategy } from "./vault-strategy.interface";
export declare class VaultModel implements VaultDTO {
  name: string;
  asset: string;
  vaultAsset: string;
  state: VaultState;
  underlyingToken: string;
  vaultToken: string;
  value: number;
  available: number;
  balance: number;
  protocol: Protocol;
  pricePerFullShare: number;
  tokens: TokenValue[];
  apr: number;
  apy: number;
  boost: BoostConfig;
  minApr: number;
  maxApr: number;
  minApy: number;
  maxApy: number;
  sources: ValueSource[];
  sourcesApy: ValueSource[];
  bouncer: BouncerType;
  strategy: VaultStrategy;
  type: VaultType;
  behavior: VaultBehavior;
  yieldProjection: VaultYieldProjection;
  lastHarvest: number;
  version: VaultVersion;
  constructor({
    name,
    state,
    asset,
    vaultAsset,
    underlyingToken,
    vaultToken,
    value,
    available,
    balance,
    protocol,
    pricePerFullShare,
    tokens,
    apr,
    apy,
    boost,
    minApr,
    maxApr,
    minApy,
    maxApy,
    sources,
    sourcesApy,
    bouncer,
    strategy,
    type,
    behavior,
    yieldProjection,
    lastHarvest,
    version
  }: VaultDTO);
}
