import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { Network } from '@badger-dao/sdk';
import { ethers } from 'ethers';
import createMockInstance from 'jest-create-mock-instance';
import { loadChains } from '../chains/chain';
import { Arbitrum } from '../chains/config/arbitrum.config';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Ethereum } from '../chains/config/eth.config';
import { Polygon } from '../chains/config/matic.config';
import { xDai } from '../chains/config/xdai.config';
import { ONE_DAY_MS, ONE_MINUTE_MS, SAMPLE_DAYS } from '../config/constants';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { CachedBoost } from '../leaderboards/interface/cached-boost.interface';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';

export const TEST_ADDR = '0xe6487033F5C8e2b4726AF54CA1449FEC18Bd1484';

/* eslint-disable @typescript-eslint/ban-ts-comment */
export const setupMapper = (items: unknown[], filter?: (items: unknown[]) => unknown[]) => {
  // @ts-ignore
  const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
  let result = items;
  if (filter) {
    result = filter(items);
  }
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => result.values());
  return jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => qi);
};
/* eslint-enable @typescript-eslint/ban-ts-comment */

export const randomValue = (min?: number, max?: number): number => {
  const minPrice = min || 10;
  const maxPrice = max || 50000;
  return minPrice + Math.random() * (maxPrice - minPrice);
};

export function randomSnapshot(settDefinition?: SettDefinition): CachedSettSnapshot {
  const sett = settDefinition || randomSett();
  const balance = randomValue();
  const supply = randomValue();
  const ratio = balance / supply;
  return Object.assign(new CachedSettSnapshot(), {
    address: sett.settToken,
    balance,
    ratio,
    settValue: randomValue(),
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

export function randomSett(): SettDefinition {
  const definitions = loadChains().flatMap((chain) => chain.setts);
  return definitions[Math.floor(Math.random() * definitions.length)];
}

export function randomSnapshots(settDefinition?: SettDefinition, count?: number): SettSnapshot[] {
  const snapshots: SettSnapshot[] = [];
  const snapshotCount = count || SAMPLE_DAYS;
  const sett = settDefinition || randomSett();
  for (let i = 0; i < snapshotCount; i++) {
    snapshots.push(
      Object.assign(new SettSnapshot(), {
        asset: sett.name,
        height: 0,
        timestamp: Date.now() - 1 - i * ONE_MINUTE_MS * 30,
        balance: randomValue(),
        supply: randomValue(),
        ratio: 1,
        value: randomValue(),
      }),
    );
  }
  return snapshots;
}

export function randomPerformance(): [SettSnapshot, SettSnapshot] {
  const [current, initial] = randomSnapshots(randomSett(), 2);
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
        nftMultiplier: 1,
        stakeRatio: 1 - i * 0.01,
        nativeBalance: 100000 / (i + 1),
        nonNativeBalance: 250000 / (i + 1),
      }),
    );
  }
  return boosts;
}
