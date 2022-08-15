/// <reference types="jest" />
import { QueryIterator, StringToAnyObjectMap } from "@aws/dynamodb-data-mapper";
import BadgerSDK, { Network, VaultDTO, VaultSnapshot } from "@badger-dao/sdk";
import { CachedAccount } from "../aws/models/cached-account.model";
import { CachedBoost } from "../aws/models/cached-boost.model";
import { VaultDefinitionModel } from "../aws/models/vault-definition.model";
import { Arbitrum } from "../chains/config/arbitrum.config";
import { BinanceSmartChain } from "../chains/config/bsc.config";
import { Ethereum } from "../chains/config/eth.config";
import { Fantom } from "../chains/config/fantom.config";
import { Polygon } from "../chains/config/polygon.config";
export declare const TEST_CHAIN:
  | Arbitrum
  | BinanceSmartChain
  | Ethereum
  | Fantom
  | import("../chains/config/optimism.config").Optimism
  | Polygon;
export declare const CURRENT_BLOCK = 0;
export declare function mockVaultDTO(address: string): VaultDTO;
export declare function setupMapper(
  items: unknown[],
  filter?: (items: unknown[]) => unknown[]
): jest.SpyInstance<
  QueryIterator<StringToAnyObjectMap>,
  [parameters: import("@aws/dynamodb-data-mapper").QueryParameters<StringToAnyObjectMap>]
>;
export declare function setupBatchGet(
  items: unknown[],
  filter?: (items: unknown[]) => unknown[]
): jest.SpyInstance<
  AsyncIterableIterator<StringToAnyObjectMap>,
  [
    import("@aws/dynamodb-data-mapper").SyncOrAsyncIterable<StringToAnyObjectMap>,
    (import("@aws/dynamodb-data-mapper").BatchGetOptions | undefined)?
  ]
>;
export declare function mockBatchPut(
  items: unknown[]
): jest.SpyInstance<
  AsyncIterableIterator<StringToAnyObjectMap>,
  [items: import("@aws/dynamodb-data-mapper").SyncOrAsyncIterable<StringToAnyObjectMap>]
>;
export declare function mockBatchDelete(
  items: unknown[]
): jest.SpyInstance<
  AsyncIterableIterator<StringToAnyObjectMap>,
  [items: import("@aws/dynamodb-data-mapper").SyncOrAsyncIterable<StringToAnyObjectMap>]
>;
export declare function setupVaultsCoumpoundDDB(): void;
export declare function setupVaultsHistoricDDB(): void;
export declare function setupDdbVaultsChartsData(): void;
export declare function defaultAccount(address: string): CachedAccount;
export declare const randomValue: (min?: number, max?: number) => number;
export declare function randomSnapshot(vaultDefinition?: VaultDefinitionModel): VaultSnapshot;
export declare function randomSnapshots(vaultDefinition?: VaultDefinitionModel, count?: number): VaultSnapshot[];
export declare function setupChainGasPrices(): void;
export declare function randomCachedBoosts(count: number): CachedBoost[];
export declare function setupMockAccounts(): void;
export declare function setFullTokenDataMock(): void;
export declare function mockPricing(): void;
export declare function mockChainVaults(): void;
export declare function mockBadgerSdk({
  addr,
  network,
  currBlock
}?: {
  addr?: string;
  network?: Network;
  currBlock?: number;
}): Promise<BadgerSDK>;
