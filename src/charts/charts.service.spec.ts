import { ChartTimeFrame } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { providers } from '@0xsequence/multicall';

import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { mock } from 'jest-mock-extended';
import {
  MOCK_VAULT_DEFINITION,
  MOCK_VAULT_SNAPSHOT,
  MOCK_VAULT_SNAPSHOTS,
  TEST_ADDR,
  TEST_CURRENT_BLOCK,
} from '../test/constants';
import BadgerSDK, { RegistryService, RewardsService } from '@badger-dao/sdk';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import { TestEthereum } from '../chains/config/teth.config';
import { getVaultEntityId } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { ChartsService } from './charts.service';
import * as chartsUtils from './charts.utils';

export function setupMockChain() {
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

  return new TestEthereum(mockProvider);
}

describe('charts.service', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  describe('loadVaultChartData', () => {
    it('returns requested vault chart data if exists', async () => {
      const chain = setupMockChain();
      const service = PlatformTest.get<ChartsService>(ChartsService);
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
      const charts = await service.loadVaultChartData(MOCK_VAULT_SNAPSHOT.address, ChartTimeFrame.Max, chain);
      expect(charts).toMatchSnapshot();
    });
  });
});
