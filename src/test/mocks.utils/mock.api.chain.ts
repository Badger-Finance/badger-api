import { providers } from '@0xsequence/multicall';
import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import BadgerSDK, {
  Currency,
  GovernanceService,
  Network,
  ONE_DAY_MS,
  RegistryService,
  RewardsService,
  TokensService,
  TokenValue,
  VaultsService,
  VaultYieldProjectionV3,
} from '@badger-dao/sdk';
import rewardsLoadSchedulesMock from '@badger-dao/sdk-mocks/generated/ethereum/rewards/loadSchedules.json';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import createMockInstance from 'jest-create-mock-instance';
import { any, mock } from 'jest-mock-extended';

import { getVaultEntityId } from '../../aws/dynamodb.utils';
import { Vaultish } from '../../aws/interfaces/vaultish.interface';
import { CachedYieldSource } from '../../aws/models/cached-yield-source.interface';
import { CurrentVaultSnapshotModel } from '../../aws/models/current-vault-snapshot.model';
import { HistoricVaultSnapshotModel } from '../../aws/models/historic-vault-snapshot.model';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldEstimate } from '../../aws/models/yield-estimate.model';
import * as s3Utils from '../../aws/s3.utils';
import * as chainsUtils from '../../chains/chains.utils';
import { Chain } from '../../chains/config/chain.config';
import { TestEthereum } from '../../chains/config/test.config';
import { ChainVaults } from '../../chains/vaults/chain.vaults';
import * as chartsUtils from '../../charts/charts.utils';
import { TOKENS } from '../../config/tokens.config';
import { PricingType } from '../../prices/enums/pricing-type.enum';
import * as pricesUtils from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { fullTokenMockMap } from '../../tokens/mocks/full-token.mock';
import * as tokensUtils from '../../tokens/tokens.utils';
import { vaultsHarvestsMapMock } from '../../vaults/mocks/vaults-harvests-map.mock';
import { VAULT_SOURCE } from '../../vaults/vaults.config';
import * as vaultsUtils from '../../vaults/vaults.utils';
import { createYieldSource } from '../../vaults/yields.utils';
import {
  MOCK_DISTRIBUTION_FILE,
  MOCK_HARVESTS,
  MOCK_TOKENS,
  MOCK_VAULT_DEFINITION,
  MOCK_VAULT_SNAPSHOT,
  MOCK_VAULT_SNAPSHOTS,
  MOCK_VAULTS,
  TEST_ADDR,
  TEST_CURRENT_BLOCK,
  TEST_CURRENT_TIMESTAMP,
  TEST_TOKEN,
} from '../constants';
import { MockOptions } from '../interfaces/mock-options.interface';
import { mockBatchGet, mockBatchPut } from './dynamo.db/mock.calls';
import { mockBalance, mockPrice } from './mock.helpers';

export function setupMockChain(
  { network, pricing, rewards }: MockOptions = {
    network: Network.Ethereum,
    pricing: true,
    rewards: true,
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
  mockMulticall.getBlock.calledWith(any()).mockImplementation(async (_n) => ({
    hash: '',
    transactions: [],
    number: TEST_CURRENT_BLOCK,
    timestamp: TEST_CURRENT_TIMESTAMP,
    parentHash: '',
    nonce: '',
    difficulty: 0,
    _difficulty: BigNumber.from('0'),
    gasLimit: BigNumber.from('0'),
    gasUsed: BigNumber.from('0'),
    miner: '',
    extraData: '',
  }));

  // setup chain sdk
  jest.spyOn(BadgerSDK.prototype, 'getMulticallProvider').mockImplementation((_p) => mockMulticall);
  jest.spyOn(RegistryService.prototype, 'ready').mockImplementation();
  jest.spyOn(GovernanceService.prototype, 'ready').mockImplementation();
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

  if (rewards) {
    jest.spyOn(s3Utils, 'getTreeDistribution').mockImplementation(async (requestedChain: Chain) => {
      if (requestedChain.network !== Network.Ethereum) {
        throw new Error('Expected test error: getObject');
      }
      return MOCK_DISTRIBUTION_FILE;
    });
  }

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
    jest.spyOn(pricesUtils, 'queryPrice').mockImplementation(async (token, _currency) => mockPrice(token));
    jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (_chain, token) => mockPrice(token));
    jest.spyOn(pricesUtils, 'convert').mockImplementation(async (price: number, currency?: Currency) => {
      if (!currency || currency === Currency.USD) {
        return price;
      }
      return price / 2;
    });
    jest.spyOn(pricesUtils, 'queryPriceAtTimestamp').mockImplementation(async (token, timestamp, _c) => {
      const { price } = mockPrice(token);
      // deterministic price modulation using a really shit hash like fn
      const timestampPrice = (price * (timestamp % price)) / 73;
      return { price: timestampPrice, updatedAt: timestamp, address: token };
    });
  }

  return chain;
}

export function setupDdbHarvests() {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  jest.spyOn(DataMapper.prototype, 'query').mockImplementation((_model, _condition) => {
    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => {
      return (vaultsHarvestsMapMock[_condition.vault] || []).values();
    });

    return qi;
  });
  /* eslint-enable @typescript-eslint/ban-ts-comment */
}

export function setupTestVault() {
  jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_, token) => MOCK_TOKENS[token]);
  const baseTime = 1656606946;
  jest.spyOn(Date, 'now').mockImplementation(() => baseTime * 1000 + ONE_DAY_MS * 14);
  jest.spyOn(vaultsUtils, 'queryYieldEstimate').mockImplementation(
    async (vaultDefinition: VaultDefinitionModel): Promise<YieldEstimate> => ({
      id: getVaultEntityId({ network: vaultDefinition.chain }, vaultDefinition),
      chain: vaultDefinition.chain,
      vault: vaultDefinition.address,
      yieldTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      harvestTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      lastHarvestedAt: baseTime,
      lastMeasuredAt: baseTime,
      previousYieldTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      previousHarvestTokens: [mockBalance(fullTokenMockMap[TOKENS.CVX], 10)],
      duration: 60000,
      lastReportedAt: 0,
    }),
  );
  jest.spyOn(vaultsUtils, 'queryYieldProjection').mockImplementation(async () => {
    const baseProjection: VaultYieldProjectionV3 = JSON.parse(JSON.stringify(MOCK_VAULTS[14].yieldProjection));
    baseProjection.nonHarvestSources = MOCK_VAULTS[14].yieldProjection.nonHarvestSources.map((s) => ({
      ...s,
      performance: {
        baseYield: s.apr,
        minYield: s.minApr,
        maxYield: s.maxApr,
        grossYield: s.apr,
        minGrossYield: s.minApr,
        maxGrossYield: s.maxApr,
      },
    }));
    baseProjection.nonHarvestSourcesApy = MOCK_VAULTS[14].yieldProjection.nonHarvestSourcesApy.map((s) => ({
      ...s,
      performance: {
        baseYield: s.apr,
        minYield: s.minApr,
        maxYield: s.maxApr,
        grossYield: s.apr,
        minGrossYield: s.minApr,
        maxGrossYield: s.maxApr,
      },
    }));
    return baseProjection;
  });
  jest
    .spyOn(vaultsUtils, 'getCachedVault')
    .mockImplementation(
      async (_c: Chain, _v: VaultDefinitionModel) => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel,
    );
  jest
    .spyOn(vaultsUtils, 'queryYieldSources')
    .mockImplementation(async (vault: VaultDefinitionModel): Promise<CachedYieldSource[]> => {
      const performance = parseInt(vault.address.slice(0, 5), 16) / 100;
      const underlying = createYieldSource(vault, SourceType.Compound, VAULT_SOURCE, performance);
      const badger = createYieldSource(vault, SourceType.Emission, 'Badger Rewards', performance);
      const fees = createYieldSource(vault, SourceType.TradeFee, 'Curve LP Fees', performance);
      return [underlying, badger, fees];
    });
  jest
    .spyOn(tokensUtils, 'getVaultTokens')
    .mockImplementation(async (_chain: Chain, _vault: Vaultish, _currency?: string): Promise<TokenValue[]> => {
      const token = fullTokenMockMap[TOKENS.BADGER];
      if (token.type === PricingType.UniV2LP) {
        const bal0 = parseInt(token.address.slice(0, 4), 16);
        const bal1 = parseInt(token.address.slice(0, 6), 16);
        return [mockBalance(token, bal0), mockBalance(token, bal1)];
      }
      return [mockBalance(token, parseInt(token.address.slice(0, 4), 16))];
    });
}
