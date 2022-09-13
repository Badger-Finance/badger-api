import { Currency, Network, ONE_DAY_MS, Token, TokenValue, VaultSnapshot } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { CachedAccount } from '../../aws/models/cached-account.model';
import { CachedBoost } from '../../aws/models/cached-boost.model';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { LeaderBoardType } from '../../leaderboards/enums/leaderboard-type.enum';
import { MOCK_VAULT_DEFINITION, TEST_ADDR } from '../constants';
import { randomValue } from '../tests.utils';

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
      aumFee: 0,
    },
    boostWeight: 5100,
    available,
    apr: 8.323,
    grossApr: 10.323,
    yieldApr: 8.4,
    harvestApr: 8.37,
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
        aumFee: 0,
      },
      boostWeight: 5100,
      apr: 13.254,
      grossApr: 15.23,
      yieldApr: 8.4,
      harvestApr: 8.37,
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
      updatedAt: 1000,
    };
    boosts.push(Object.assign(new CachedBoost(), boost));
  }
  return boosts;
}

export function defaultAccount(address: string): CachedAccount {
  return {
    address,
    balances: [],
    updatedAt: 0,
  };
}

export function mockBalance(token: Token, balance: number, currency?: Currency): TokenValue {
  let price = parseInt(token.address.slice(0, 5), 16);
  if (currency && currency !== Currency.USD) {
    price /= 2;
  }
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price,
  };
}
