/* eslint-disable @typescript-eslint/ban-ts-comment */

import { providers } from '@0xsequence/multicall';
import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import BadgerSDK, { Currency, RegistryService, RewardsService, Token, TokenValue } from '@badger-dao/sdk';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import createMockInstance from 'jest-create-mock-instance';
import { mock } from 'jest-mock-extended';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { TestEthereum } from '../chains/config/teth.config';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import * as chartsUtils from '../charts/charts.utils';
import {
  MOCK_VAULT_DEFINITION,
  MOCK_VAULT_SNAPSHOT,
  MOCK_VAULT_SNAPSHOTS,
  TEST_ADDR,
  TEST_CURRENT_BLOCK,
  TEST_CURRENT_TIMESTAMP,
} from './constants';
import * as pricesUtils from '../prices/prices.utils';

export function setupMockChain() {
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

  jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => MOCK_VAULT_DEFINITION);
  jest.spyOn(ChainVaults.prototype, 'all').mockImplementation(async () => [MOCK_VAULT_DEFINITION]);

  const mockSigner = mock<JsonRpcSigner>();
  mockSigner.getAddress.calledWith().mockImplementation(async () => TEST_ADDR);
  const mockProvider = mock<JsonRpcProvider>();
  mockProvider.getSigner.calledWith().mockImplementation(() => mockSigner);
  mockProvider.getBlockNumber.calledWith().mockImplementation(async () => TEST_CURRENT_BLOCK);

  const mockMulticall = mock<providers.MulticallProvider>();
  jest.spyOn(BadgerSDK.prototype, 'getMulticallProvider').mockImplementation((_p) => mockMulticall);
  jest.spyOn(RegistryService.prototype, 'ready').mockImplementation();
  jest.spyOn(RewardsService.prototype, 'ready').mockImplementation();

  jest.spyOn(TestEthereum.prototype, 'getGasPrices').mockImplementation(async () => ({
    rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
    fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
    standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
    slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 },
  }));

  const chain = new TestEthereum(mockProvider);

  // setup vault charts for the mock vault
  jest.spyOn(chartsUtils, 'queryVaultCharts').mockImplementation(async (_k) =>
    MOCK_VAULT_SNAPSHOTS.slice(0, 4).map((snapshot) => {
      const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
        ...snapshot,
        id: getVaultEntityId(chain, MOCK_VAULT_SNAPSHOT),
        timestamp: TEST_CURRENT_TIMESTAMP,
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

export function mockQueryResults(items: unknown[], filter?: (items: unknown[]) => unknown[]) {
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
