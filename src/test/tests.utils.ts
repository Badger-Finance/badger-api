/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DataMapper, QueryIterator, StringToAnyObjectMap } from "@aws/dynamodb-data-mapper";
import BadgerSDK, { Network, ONE_DAY_MS, RegistryService, RewardsService, VaultSnapshot } from "@badger-dao/sdk";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";
import createMockInstance from "jest-create-mock-instance";
import { mock } from "jest-mock-extended";

import VaultsCompoundMock from "../../seed/vault-definition.json";
import * as accountsUtils from "../accounts/accounts.utils";
import * as dynamodbUtils from "../aws/dynamodb.utils";
import { CachedAccount } from "../aws/models/cached-account.model";
import { CachedBoost } from "../aws/models/cached-boost.model";
import { VaultDefinitionModel } from "../aws/models/vault-definition.model";
import { SUPPORTED_CHAINS } from "../chains/chain";
import { LeaderBoardType } from "../leaderboards/enums/leaderboard-type.enum";
import { Nullable } from "../utils/types.utils";
import { vaultsChartDataMock } from "../vaults/mocks/vaults-chart-data.mock";
import { MOCK_VAULT_DEFINITION, TEST_ADDR, TEST_CURRENT_BLOCK } from "./constants";

// @ts-ignore
export function setupVaultsCoumpoundDDB(customFilter: Nullable<(v: any) => boolean> = null) {
  // @ts-ignore
  jest.spyOn(DataMapper.prototype, "query").mockImplementation((model, keys) => {
    let dataSource = VaultsCompoundMock;
    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);

    if (keys.chain) dataSource = dataSource.filter((v) => v.chain === keys.chain);
    if (keys.isProduction) dataSource = dataSource.filter((v) => v.isProduction === keys.isProduction);
    if (customFilter) dataSource = dataSource.filter(customFilter);

    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => dataSource.map((obj) => Object.assign(new model(), obj)).values());
    return qi;
  });
}

export function setupDdbVaultsChartsData() {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  jest.spyOn(DataMapper.prototype, "query").mockImplementation((_model, _condition) => {
    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
    const vaultsChart = vaultsChartDataMock.find((val) => val.id);
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => ((!!vaultsChart && [vaultsChart]) || []).values());

    return qi;
  });
  /* eslint-enable @typescript-eslint/ban-ts-comment */
}

export function defaultAccount(address: string): CachedAccount {
  return {
    address,
    balances: [],
    updatedAt: 0
  };
}

export const randomValue = (min?: number, max?: number): number => {
  const minPrice = min || 10;
  const maxPrice = max || 50000;
  return minPrice + Math.random() * (maxPrice - minPrice);
};

export function randomSnapshot(vaultDefinition?: VaultDefinitionModel): VaultSnapshot {
  const vault = vaultDefinition ?? MOCK_VAULT_DEFINITION;
  const balance = randomValue();
  const totalSupply = randomValue();
  const block = randomValue();
  const available = randomValue();
  const pricePerFullShare = balance / totalSupply;
  return {
    block,
    address: vault.address,
    balance,
    strategyBalance: randomValue(),
    pricePerFullShare,
    value: randomValue(),
    totalSupply,
    timestamp: Date.now(),
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 0,
      performanceFee: 0,
      strategistFee: 0,
      aumFee: 0
    },
    boostWeight: 5100,
    available,
    apr: 8.323,
    yieldApr: 8.4,
    harvestApr: 8.37
  };
}

export function randomSnapshots(vaultDefinition?: VaultDefinitionModel, count?: number): VaultSnapshot[] {
  const snapshots: VaultSnapshot[] = [];
  const snapshotCount = count ?? 50;
  const vault = vaultDefinition ?? MOCK_VAULT_DEFINITION;
  const currentTimestamp = Date.now();
  const start = currentTimestamp - (currentTimestamp % ONE_DAY_MS);
  for (let i = 0; i < snapshotCount; i++) {
    snapshots.push({
      address: vault.address,
      block: 10_000_000 - i * 1_000,
      timestamp: start - i * ONE_DAY_MS,
      balance: randomValue(),
      strategyBalance: randomValue(),
      totalSupply: randomValue(),
      pricePerFullShare: 3 - i * 0.015,
      value: randomValue(),
      available: randomValue(),
      strategy: {
        address: ethers.constants.AddressZero,
        withdrawFee: 50,
        performanceFee: 20,
        strategistFee: 0,
        aumFee: 0
      },
      boostWeight: 5100,
      apr: 13.254,
      yieldApr: 8.4,
      harvestApr: 8.37
    });
  }
  return snapshots;
}

export function randomCachedBoosts(count: number): CachedBoost[] {
  const boosts = [];
  for (let i = 0; i < count; i += 1) {
    const boost: CachedBoost = {
      leaderboard: `${Network.Ethereum}_${LeaderBoardType.BadgerBoost}`,
      boostRank: i + 1,
      address: TEST_ADDR,
      boost: 2000 - i * 10,
      nftBalance: 1,
      stakeRatio: 1 - i * 0.01,
      nativeBalance: 100000 / (i + 1),
      nonNativeBalance: 250000 / (i + 1),
      bveCvxBalance: 120 * (i + 1),
      diggBalance: 1.3 * (i + 1),
      updatedAt: 1000
    };
    boosts.push(Object.assign(new CachedBoost(), boost));
  }
  return boosts;
}

export function setupMockAccounts() {
  jest.spyOn(accountsUtils, "getClaimableBalanceSnapshot").mockImplementation(async () => ({
    chainStartBlock: dynamodbUtils.getChainStartBlockKey(Network.Ethereum, 10),
    address: TEST_ADDR,
    chain: Network.Ethereum,
    startBlock: 100,
    claimableBalances: [],
    expiresAt: Date.now(),
    pageId: 0
  }));
  jest.spyOn(accountsUtils, "getLatestMetadata").mockImplementation(async (chain) => ({
    startBlock: 10,
    endBlock: 15,
    chainStartBlock: dynamodbUtils.getChainStartBlockKey(Network.Ethereum, 10),
    chain: chain.network,
    cycle: 10,
    count: 0
  }));
}

export async function mockBadgerSdk(
  // in case u want to skip one param
  {
    addr = TEST_ADDR,
    network = Network.Ethereum,
    currBlock = TEST_CURRENT_BLOCK
  }: {
    // type description
    addr?: string;
    network?: Network;
    currBlock?: number;
  } = {
    // in case u want to skip all params
    addr: TEST_ADDR,
    network: Network.Ethereum,
    currBlock: TEST_CURRENT_BLOCK
  }
): Promise<BadgerSDK> {
  const mockSigner = mock<JsonRpcSigner>();
  mockSigner.getAddress.calledWith().mockImplementation(async () => addr);
  const mockProvider = mock<JsonRpcProvider>();
  mockProvider.getSigner.calledWith().mockImplementation(() => mockSigner);
  mockProvider.getBlockNumber.calledWith().mockImplementation(async () => currBlock);

  // Services that will force contracts connection in sdk constructor
  jest.spyOn(RegistryService.prototype, "ready").mockImplementation();
  jest.spyOn(RewardsService.prototype, "ready").mockImplementation();

  return new BadgerSDK({
    network: network,
    provider: mockProvider
  });
}

// mb use this function is jest.setup to mock all sdk inits for all chains
export async function mockSupportedChains() {
  for (const chain of SUPPORTED_CHAINS) {
    const sdk = mockBadgerSdk({ network: chain.network });

    jest.spyOn(chain.constructor.prototype, "getSdk").mockImplementation(async () => sdk);
  }
}
