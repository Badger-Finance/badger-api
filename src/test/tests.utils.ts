import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { Network } from '@badger-dao/sdk';
import { ethers } from 'ethers';
import createMockInstance from 'jest-create-mock-instance';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { loadChains } from '../chains/chain';
import { Arbitrum } from '../chains/config/arbitrum.config';
import { Avalanche } from '../chains/config/avax.config';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Ethereum } from '../chains/config/eth.config';
import { Polygon } from '../chains/config/polygon.config';
import { xDai } from '../chains/config/xdai.config';
import { ONE_DAY_MS, SAMPLE_DAYS } from '../config/constants';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { CachedBoost } from '../leaderboards/interface/cached-boost.interface';
import { CachedSettSnapshot } from '../vaults/interfaces/cached-sett-snapshot.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { VaultSnapshot } from '../vaults/interfaces/vault-snapshot.interface';
import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamodbUtils from '../aws/dynamodb.utils';
import { Fantom } from '../chains/config/fantom.config';
import { Chain } from '../chains/config/chain.config';

export const TEST_CHAIN = new Ethereum();
export const TEST_ADDR = ethers.utils.getAddress('0xe6487033F5C8e2b4726AF54CA1449FEC18Bd1484');

/* eslint-disable @typescript-eslint/ban-ts-comment */
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
/* eslint-enable @typescript-eslint/ban-ts-comment */

/* eslint-disable @typescript-eslint/ban-ts-comment */
export function mockBatchPut(items: unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => items.values());
  return jest.spyOn(DataMapper.prototype, 'batchPut').mockImplementation(() => qi);
}
/* eslint-enable @typescript-eslint/ban-ts-comment */

/* eslint-disable @typescript-eslint/ban-ts-comment */
export function mockBatchDelete(items: unknown[]) {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => items.values());
  return jest.spyOn(DataMapper.prototype, 'batchDelete').mockImplementation(() => qi);
}
/* eslint-enable @typescript-eslint/ban-ts-comment */

export function defaultAccount(address: string): CachedAccount {
  return {
    address,
    boost: 0,
    boostRank: 0,
    multipliers: [],
    nftBalance: 0,
    value: 0,
    earnedValue: 0,
    balances: [],
    nativeBalance: 0,
    nonNativeBalance: 0,
    stakeRatio: 0,
  };
}

export function randomAccount(address: string): CachedAccount {
  const account = defaultAccount(address);
  account.value = randomValue();
  account.earnedValue = randomValue();
  account.boost = randomValue();
  account.boostRank = randomValue();
  return account;
}

export const randomValue = (min?: number, max?: number): number => {
  const minPrice = min || 10;
  const maxPrice = max || 50000;
  return minPrice + Math.random() * (maxPrice - minPrice);
};

export function randomSnapshot(vaultDefinition?: VaultDefinition): CachedSettSnapshot {
  const vault = vaultDefinition ?? randomVault();
  const balance = randomValue();
  const supply = randomValue();
  const ratio = balance / supply;
  return Object.assign(new CachedSettSnapshot(), {
    address: vault.vaultToken,
    balance,
    ratio,
    value: randomValue(),
    supply,
    updatedAt: Date.now(),
    strategy: {
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10,
    },
    boostWeight: 5100,
  });
}

export function randomVault(chain?: Chain): VaultDefinition {
  const definitions = (chain ? [chain] : loadChains()).flatMap((chain) => chain.vaults);
  return definitions[Math.floor(Math.random() * definitions.length)];
}

export function randomSnapshots(vaultDefinition?: VaultDefinition, count?: number): VaultSnapshot[] {
  const snapshots: VaultSnapshot[] = [];
  const snapshotCount = count ?? SAMPLE_DAYS;
  const sett = vaultDefinition ?? randomVault();
  for (let i = 0; i < snapshotCount; i++) {
    snapshots.push(
      Object.assign(new VaultSnapshot(), {
        asset: sett.name,
        height: 0,
        timestamp: 1646105174169 - 1 - i * ONE_DAY_MS,
        balance: randomValue(),
        supply: randomValue(),
        ratio: 3 - i * 0.015,
        value: randomValue(),
      }),
    );
  }
  return snapshots;
}

export function randomPerformance(): [VaultSnapshot, VaultSnapshot] {
  const [current, initial] = randomSnapshots(randomVault(), 2);
  initial.timestamp = current.timestamp - ONE_DAY_MS;
  return [current, initial];
}

export function setupChainGasPrices() {
  jest.spyOn(Ethereum.prototype, 'getGasPrices').mockImplementation(async () => ({
    rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
    fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
    standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
    slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 },
  }));
  jest
    .spyOn(BinanceSmartChain.prototype, 'getGasPrices')
    .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
  jest
    .spyOn(Arbitrum.prototype, 'getGasPrices')
    .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
  jest
    .spyOn(xDai.prototype, 'getGasPrices')
    .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
  jest
    .spyOn(Polygon.prototype, 'getGasPrices')
    .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
  jest
    .spyOn(Avalanche.prototype, 'getGasPrices')
    .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
  jest
    .spyOn(Fantom.prototype, 'getGasPrices')
    .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
}

export function randomCachedBoosts(count: number): CachedBoost[] {
  const boosts = [];
  for (let i = 0; i < count; i += 1) {
    boosts.push(
      Object.assign(new CachedBoost(), {
        leaderboard: `${Network.Ethereum}_${LeaderBoardType.BadgerBoost}`,
        rank: i + 1,
        address: TEST_ADDR,
        boost: 2000 - i * 10,
        nftBalance: 1,
        stakeRatio: 1 - i * 0.01,
        nativeBalance: 100000 / (i + 1),
        nonNativeBalance: 250000 / (i + 1),
      }),
    );
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
  }));
  jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain) => ({
    startBlock: 10,
    endBlock: 15,
    chainStartBlock: dynamodbUtils.getChainStartBlockKey(chain, 10),
    chain: chain.network,
    cycle: 10,
  }));
}
