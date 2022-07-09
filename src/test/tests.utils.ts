/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import BadgerSDK, {
  Currency,
  Network,
  ONE_DAY_MS,
  RegistryService,
  RewardsService,
  VaultSnapshot,
} from '@badger-dao/sdk';
import { TokensService } from '@badger-dao/sdk/lib/tokens/tokens.service';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { ethers } from 'ethers';
import createMockInstance from 'jest-create-mock-instance';
import { mock } from 'jest-mock-extended';

import VaultsCompoundMock from '../../seed/vaults-compound.json';
import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamodbUtils from '../aws/dynamodb.utils';
import { CachedAccount } from '../aws/models/cached-account.model';
import { CachedBoost } from '../aws/models/cached-boost.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { TestChain } from '../chains/config/test-chain.config';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import * as pricesUtils from '../prices/prices.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';

export const TEST_CHAIN = new TestChain();

export const TEST_ADDR = ethers.utils.getAddress('0xe6487033F5C8e2b4726AF54CA1449FEC18Bd1484');
export const CURRENT_BLOCK = 0;

export function setupMapper(items: unknown[], filter?: (items: unknown[]) => unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  let result = items;
  if (filter) {
    result = filter(items);
  }
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => result.values());
  return jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => qi);
}

export function setupBatchGet(items: unknown[], filter?: (items: unknown[]) => unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  let result = items;
  if (filter) {
    result = filter(items);
  }
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => result.values());
  return jest.spyOn(DataMapper.prototype, 'batchGet').mockImplementation(() => qi);
}

export function mockBatchPut(items: unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => items.values());
  return jest.spyOn(DataMapper.prototype, 'batchPut').mockImplementation(() => qi);
}

export function mockBatchDelete(items: unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => items.values());
  return jest.spyOn(DataMapper.prototype, 'batchDelete').mockImplementation(() => qi);
}

export function setupVaultsCoumpoundDDB() {
  // @ts-ignore
  jest.spyOn(DataMapper.prototype, 'query').mockImplementation((model, keys) => {
    let dataSource = VaultsCompoundMock;
    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);

    if (keys.chain) dataSource = dataSource.filter((v) => v.chain === keys.chain);
    if (keys.isProduction) dataSource = dataSource.filter((v) => v.isProduction === keys.isProduction);

    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => dataSource.map((obj) => Object.assign(new model(), obj)).values());
    return qi;
  });
}

export function defaultAccount(address: string): CachedAccount {
  return {
    address,
    balances: [],
    updatedAt: 0,
  };
}

export const randomValue = (min?: number, max?: number): number => {
  const minPrice = min || 10;
  const maxPrice = max || 50000;
  return minPrice + Math.random() * (maxPrice - minPrice);
};

export function randomSnapshot(vaultDefinition?: VaultDefinition): VaultSnapshot {
  const vault = vaultDefinition ?? randomVault();
  const balance = randomValue();
  const totalSupply = randomValue();
  const block = randomValue();
  const available = randomValue();
  const pricePerFullShare = balance / totalSupply;
  return {
    block,
    address: vault.vaultToken,
    balance,
    strategyBalance: randomValue(),
    pricePerFullShare,
    value: randomValue(),
    totalSupply,
    timestamp: Date.now(),
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 0,
      aumFee: 0,
    },
    boostWeight: 5100,
    available,
    apr: 8.323,
    yieldApr: 8.4,
    harvestApr: 8.37,
  };
}

export function randomVault(chain?: Chain): VaultDefinition {
  const definitions = (chain ? [chain] : SUPPORTED_CHAINS).flatMap((chain) => chain.vaults);

  const controlledDefs = definitions.filter((vault) => {
    return vault.vaultToken in fullTokenMockMap && vault.depositToken in fullTokenMockMap;
  });

  return controlledDefs[Math.floor(Math.random() * controlledDefs.length)];
}

export function randomSnapshots(vaultDefinition?: VaultDefinition, count?: number): VaultSnapshot[] {
  const snapshots: VaultSnapshot[] = [];
  const snapshotCount = count ?? 50;
  const vault = vaultDefinition ?? randomVault();
  const currentTimestamp = Date.now();
  const start = currentTimestamp - (currentTimestamp % ONE_DAY_MS);
  for (let i = 0; i < snapshotCount; i++) {
    snapshots.push({
      address: vault.vaultToken,
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
        aumFee: 0,
      },
      boostWeight: 5100,
      apr: 13.254,
      yieldApr: 8.4,
      harvestApr: 8.37,
    });
  }
  return snapshots;
}

export function setupChainGasPrices() {
  jest.spyOn(TestChain.prototype, 'getGasPrices').mockImplementation(async () => ({
    rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
    fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
    standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
    slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 },
  }));
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
      updatedAt: 1000,
    };
    boosts.push(Object.assign(new CachedBoost(), boost));
  }
  return boosts;
}

export function setupMockAccounts() {
  jest.spyOn(accountsUtils, 'getClaimableBalanceSnapshot').mockImplementation(async () => ({
    chainStartBlock: dynamodbUtils.getChainStartBlockKey(TEST_CHAIN, 10),
    address: TEST_ADDR,
    chain: TEST_CHAIN.network,
    startBlock: 100,
    claimableBalances: [],
    expiresAt: Date.now(),
    pageId: 0,
  }));
  jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain) => ({
    startBlock: 10,
    endBlock: 15,
    chainStartBlock: dynamodbUtils.getChainStartBlockKey(chain, 10),
    chain: chain.network,
    cycle: 10,
    count: 0,
  }));
}

export function setFullTokenDataMock() {
  const fullTokenObjList = Object.values(fullTokenMockMap);

  setupBatchGet(fullTokenObjList);
  mockBatchPut(fullTokenObjList);

  jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => fullTokenMockMap);
}

export function mockPricing() {
  jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token: string, _currency?: Currency) => ({
    address: token,
    price: parseInt(token.slice(0, 5), 16),
    updatedAt: Date.now(),
  }));
  jest.spyOn(pricesUtils, 'convert').mockImplementation(async (price: number, currency?: Currency) => {
    if (!currency || currency === Currency.USD) {
      return price;
    }
    return price / 2;
  });
}

export async function mockBadgerSdk(
  // in case u want to skip one param
  {
    addr = TEST_ADDR,
    network = Network.Ethereum,
    currBlock = CURRENT_BLOCK,
  }: {
    // type description
    addr?: string;
    network?: Network;
    currBlock?: number;
  } = {
    // in case u want to skip all params
    addr: TEST_ADDR,
    network: Network.Ethereum,
    currBlock: CURRENT_BLOCK,
  },
): Promise<BadgerSDK> {
  const mockSigner = mock<JsonRpcSigner>();
  mockSigner.getAddress.calledWith().mockImplementation(async () => addr);
  const mockProvider = mock<JsonRpcProvider>();
  mockProvider.getSigner.calledWith().mockImplementation(() => mockSigner);
  mockProvider.getBlockNumber.calledWith().mockImplementation(async () => currBlock);

  // Services that will force contracts connection in sdk constructor
  jest.spyOn(RegistryService.prototype, 'ready').mockImplementation();
  jest.spyOn(RewardsService.prototype, 'ready').mockImplementation();

  return new BadgerSDK({
    network: network,
    provider: mockProvider,
  });
}
