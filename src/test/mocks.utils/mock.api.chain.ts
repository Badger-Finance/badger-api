import { providers } from '@0xsequence/multicall';
import BadgerSDK, {
  Currency,
  Network,
  RegistryService,
  RewardsService,
  TokensService,
  VaultsService,
} from '@badger-dao/sdk';
import rewardsLoadSchedulesMock from '@badger-dao/sdk-mocks/generated/ethereum/rewards/loadSchedules.json';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { mock } from 'jest-mock-extended';

import { getVaultEntityId } from '../../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../../aws/models/historic-vault-snapshot.model';
import * as chainsUtils from '../../chains/chains.utils';
import { Chain } from '../../chains/config/chain.config';
import { TestEthereum } from '../../chains/config/test.config';
import { ChainVaults } from '../../chains/vaults/chain.vaults';
import * as chartsUtils from '../../charts/charts.utils';
import * as pricesUtils from '../../prices/prices.utils';
import * as rewardsUtils from '../../rewards/rewards.utils';
import {
  MOCK_DISTRIBUTION_FILE,
  MOCK_HARVESTS,
  MOCK_TOKENS,
  MOCK_VAULT_DEFINITION,
  MOCK_VAULT_SNAPSHOT,
  MOCK_VAULT_SNAPSHOTS,
  TEST_ADDR,
  TEST_CURRENT_BLOCK,
  TEST_CURRENT_TIMESTAMP,
  TEST_TOKEN,
} from '../constants';
import { MockOptions } from '../interfaces/mock-options.interface';
import { mockBatchGet, mockBatchPut } from './dynamo.db/mock.calls';

export function setupMockChain(
  { network, pricing }: MockOptions = {
    network: Network.Ethereum,
    pricing: true,
  },
) {
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

  const baseSchedules = rewardsLoadSchedulesMock.slice(0, 3);

  const schedulesMockMap = {
    [TEST_TOKEN]: baseSchedules,
    [TEST_ADDR]: baseSchedules.map((rw) => ({
      ...rw,
      beneficiary: TEST_ADDR,
    })),
  };

  const activeSchedulesMockMap = {
    [TEST_TOKEN]: schedulesMockMap[TEST_TOKEN].map((rw) => ({
      ...rw,
      compPercent: 50,
    })),
    [TEST_ADDR]: schedulesMockMap[TEST_ADDR].map((rw) => ({
      ...rw,
      compPercent: 70,
    })),
  };

  jest.spyOn(RewardsService.prototype, 'loadSchedules').mockImplementation(async (_b) => {
    return schedulesMockMap[TEST_TOKEN];
  });
  jest.spyOn(RewardsService.prototype, 'loadActiveSchedules').mockImplementation(async (_b) => {
    return activeSchedulesMockMap[TEST_TOKEN];
  });
  jest
    .spyOn(TokensService.prototype, 'loadTokens')
    .mockImplementation(async (tokens) =>
      Object.fromEntries(Object.entries(MOCK_TOKENS).filter((e) => tokens.includes(e[0]))),
    );
  jest.spyOn(TokensService.prototype, 'loadToken').mockImplementation(async (token) => MOCK_TOKENS[token]);
  const chainTokensList = Object.values(MOCK_TOKENS);
  mockBatchGet(chainTokensList);
  mockBatchPut(chainTokensList);
  jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async () => MOCK_HARVESTS);

  // for some reason this causes tests leaks
  jest.spyOn(rewardsUtils, 'getTreeDistribution').mockImplementation(async (requestedChain: Chain) => {
    if (requestedChain.network !== Network.Ethereum) {
      return null;
    }
    return MOCK_DISTRIBUTION_FILE;
  });

  // setup vault charts for the mock vault
  jest.spyOn(chartsUtils, 'queryVaultCharts').mockImplementation(async (_k) =>
    MOCK_VAULT_SNAPSHOTS.slice(0, 4).map((snapshot) => {
      const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
        ...snapshot,
        id: getVaultEntityId({ network: Network.Ethereum }, MOCK_VAULT_SNAPSHOT),
        timestamp: TEST_CURRENT_TIMESTAMP,
        chain: Network.Ethereum,
        ratio: snapshot.pricePerFullShare,
      });
      return historicSnapshot;
    }),
  );

  const chain = new TestEthereum(mockProvider, network);

  jest.spyOn(Chain, 'getChain').mockImplementation(() => chain);
  // jest.spyOn(chainsUtils, 'getOrCreateChain').mockImplementation((_n) => chain);
  jest.spyOn(chainsUtils, 'getSupportedChains').mockImplementation(() => [chain]);

  // setup chain pricing
  if (pricing) {
    jest
      .spyOn(pricesUtils, 'queryPrice')
      .mockImplementation(async (token, _currency) => chain.strategy.getPrice(token));
    jest.spyOn(pricesUtils, 'convert').mockImplementation(async (price: number, currency?: Currency) => {
      if (!currency || currency === Currency.USD) {
        return price;
      }
      return price / 2;
    });
  }

  return chain;
}
