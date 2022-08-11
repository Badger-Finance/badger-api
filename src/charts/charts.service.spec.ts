import { ChartTimeFrame } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { MOCK_VAULT_SNAPSHOT, MOCK_VAULT_SNAPSHOTS, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { mockChainVaults, TEST_CHAIN } from '../test/tests.utils';
import { ChartsService } from './charts.service';
import * as chartsUtils from './charts.utils';

describe('charts.service', () => {
  let service: ChartsService;

  beforeAll(async () => {
    await PlatformTest.create();

    service = PlatformTest.get<ChartsService>(ChartsService);
  });

  afterEach(PlatformTest.reset);

  describe('loadVaultChartData', () => {
    it('returns requested vault chart data if exists', async () => {
      mockChainVaults();
      jest.spyOn(chartsUtils, 'queryVaultCharts').mockImplementation(async (_k) =>
        MOCK_VAULT_SNAPSHOTS.slice(0, 4).map((snapshot) => {
          const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
            ...snapshot,
            id: getVaultEntityId(TEST_CHAIN, MOCK_VAULT_SNAPSHOT),
            timestamp: TEST_CURRENT_TIMESTAMP,
          });
          return historicSnapshot;
        }),
      );
      const charts = await service.loadVaultChartData(MOCK_VAULT_SNAPSHOT.address, ChartTimeFrame.Max, TEST_CHAIN);
      expect(charts).toMatchSnapshot();
    });
  });
});
