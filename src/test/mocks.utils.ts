/* eslint-disable @typescript-eslint/ban-ts-comment */

import { providers } from '@0xsequence/multicall';
import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import BadgerSDK, {
  Currency,
  RegistryService,
  RewardsService,
  Token,
  TokensService,
  TokenValue,
} from '@badger-dao/sdk';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import createMockInstance from 'jest-create-mock-instance';
import { mock } from 'jest-mock-extended';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { TestEthereum } from '../chains/config/teth.config';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import * as chartsUtils from '../charts/charts.utils';
import * as pricesUtils from '../prices/prices.utils';
import * as rewardsUtils from '../rewards/rewards.utils';
import {
  MOCK_DISTRIBUTION_FILE,
  MOCK_TOKENS,
  MOCK_VAULT_DEFINITION,
  MOCK_VAULT_SNAPSHOT,
  MOCK_VAULT_SNAPSHOTS,
  TEST_ADDR,
  TEST_CURRENT_BLOCK,
  TEST_CURRENT_TIMESTAMP,
} from './constants';

export function setupMockChain() {
  // setup chain pricing
  jest.spyOn(pricesUtils, 'queryPrice').mockImplementation(async (token: string, _currency?: Currency) => ({
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

  // setup chain vaults
  jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => MOCK_VAULT_DEFINITION);
  jest.spyOn(ChainVaults.prototype, 'all').mockImplementation(async () => [MOCK_VAULT_DEFINITION]);

  // setup chain providers
  const mockSigner = mock<JsonRpcSigner>();
  mockSigner.getAddress.calledWith().mockImplementation(async () => TEST_ADDR);
  const mockProvider = mock<JsonRpcProvider>();
  mockProvider.getSigner.calledWith().mockImplementation(() => mockSigner);
  mockProvider.getBlockNumber.calledWith().mockImplementation(async () => TEST_CURRENT_BLOCK);

  const mockMulticall = mock<providers.MulticallProvider>();
  mockMulticall.getBlockNumber.calledWith().mockImplementation(async () => TEST_CURRENT_BLOCK);

  // setup chain sdk
  jest.spyOn(BadgerSDK.prototype, 'getMulticallProvider').mockImplementation((_p) => mockMulticall);
  jest.spyOn(RegistryService.prototype, 'ready').mockImplementation();
  jest.spyOn(RewardsService.prototype, 'ready').mockImplementation();
  jest.spyOn(RewardsService.prototype, 'hasBadgerTree').mockImplementation(() => true);
  jest
    .spyOn(TokensService.prototype, 'loadTokens')
    .mockImplementation(async (tokens) =>
      Object.fromEntries(Object.entries(MOCK_TOKENS).filter((e) => tokens.includes(e[0]))),
    );
  jest.spyOn(TokensService.prototype, 'loadToken').mockImplementation(async (token) => MOCK_TOKENS[token]);
  const chainTokensList = Object.values(MOCK_TOKENS);
  mockBatchGet(chainTokensList);
  mockBatchPut(chainTokensList);

  const chain = new TestEthereum(mockProvider);

  jest.spyOn(Chain.prototype, 'getGasPrices').mockImplementation(async () => ({
    rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
    fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
    standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
    slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 },
  }));

  jest.spyOn(rewardsUtils, 'getTreeDistribution').mockImplementation(async (requestedChain: Chain) => {
    if (chain.network !== requestedChain.network) {
      return null;
    }
    return MOCK_DISTRIBUTION_FILE;
  });

  // setup vault charts for the mock vault
  jest.spyOn(chartsUtils, 'queryVaultCharts').mockImplementation(async (_k) =>
    MOCK_VAULT_SNAPSHOTS.slice(0, 4).map((snapshot) => {
      const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
        ...snapshot,
        id: getVaultEntityId(chain, MOCK_VAULT_SNAPSHOT),
        timestamp: TEST_CURRENT_TIMESTAMP,
        chain: chain.network,
        ratio: snapshot.pricePerFullShare,
      });
      return historicSnapshot;
    }),
  );

  return chain;
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

export function mockQuery(items: unknown[], filter?: (items: unknown[]) => unknown[]) {
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

export function mockBatchGet(items: unknown[], filter?: (items: unknown[]) => unknown[]) {
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