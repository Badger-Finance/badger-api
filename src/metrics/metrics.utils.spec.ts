import * as AccountUtils from '../accounts/accounts.utils';
import { SettsService } from '../setts/setts.service';
import { getProtocolMetrics, getSettsMetrics, getTotalUsers } from './metric.utils';

describe('metrics.utils', () => {
  beforeEach(() => {
    jest
      .spyOn(AccountUtils, 'getAccounts')
      .mockReturnValue(
        Promise.resolve([
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000002',
          '0x0000000000000000000000000000000000000003',
          '0x0000000000000000000000000000000000000004',
          '0x0000000000000000000000000000000000000005',
          '0x0000000000000000000000000000000000000006',
        ]),
      );

    jest.spyOn(SettsService.prototype, 'getProtocolSummary').mockReturnValue(
      Promise.resolve({
        totalValue: 1000,
        setts: [{ name: 'testSett', balance: 1000, value: 1000 }],
      }),
    );
  });

  describe('getTotalUsers', () => {
    it('returns total users', async () => {
      const totalUsers = await getTotalUsers();
      expect(totalUsers).toMatchSnapshot();
    });
  });

  describe('getSettsMetrics', () => {
    it('returns setts metrics', async () => {
      const metrics = await getSettsMetrics();
      expect(metrics).toMatchSnapshot();
    });
  });

  describe('getProtocolMetrics', () => {
    it('returns protocolMetrics', async () => {
      const metrics = await getProtocolMetrics();
      expect(metrics).toMatchSnapshot();
    });
  });
});
