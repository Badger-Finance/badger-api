import { PlatformTest } from '@tsed/common';

import { MOCK_VAULT_SNAPSHOT, MOCK_VAULT_SNAPSHOTS, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { ChartTimeFrame } from '@badger-dao/sdk';
import { ChartsService } from './charts.service';
import * as chartsUtils from './charts.utils';
import { getVaultEntityId } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { setupMockChain } from '../test/mocks.utils';

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
