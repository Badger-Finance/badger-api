import { Vault } from '@badger-dao/sdk';
import * as accountsUtils from '../accounts/accounts.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import * as vaultUtils from '../vaults/vaults.utils';
import { getProtocolMetrics, getProtocolSettMetrics, getProtocolTotalUsers } from './metrics.utils';

describe('metrics.utils', () => {
  beforeEach(() => {
    jest
      .spyOn(accountsUtils, 'getAccounts')
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

    jest
      .spyOn(vaultUtils, 'getCachedVault')
      .mockImplementation(
        async (VaultDefinition: VaultDefinition): Promise<Vault> => vaultUtils.defaultVault(VaultDefinition),
      );
  });

  describe('getProtocolUsersMetric', () => {
    it('returns total users', async () => {
      const totalUsers = await getProtocolTotalUsers();
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
