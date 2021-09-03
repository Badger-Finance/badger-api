import * as AccountUtils from '../accounts/accounts.utils';
import * as SettUtils from '../setts/setts.utils';
import { getProtocolMetrics, getProtocolSettMetrics, getTotalUsers } from './metric.utils';
import { SettState } from '../config/enums/sett-state.enum';

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

    jest.spyOn(SettUtils, 'getCachedSett').mockReturnValue(
      Promise.resolve({
        asset: 'mockSymbol',
        apr: 0,
        balance: 100,
        boostable: false,
        deprecated: false,
        experimental: false,
        hasBouncer: false,
        name: 'mockSett',
        ppfs: 1,
        sources: [],
        state: SettState.Open,
        tokens: [],
        underlyingToken: '0x0000000000000000000000000000000000000000',
        value: 1000,
        vaultToken: '0x0000000000000000000000000000000000000000',
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
      const metrics = await getProtocolSettMetrics();
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
