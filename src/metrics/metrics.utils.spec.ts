import { VaultDTO } from '@badger-dao/sdk';

import * as accountsUtils from '../accounts/accounts.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { mockChainVaults } from '../test/tests.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokenUtils from '../tokens/tokens.utils';
import * as vaultUtils from '../vaults/vaults.utils';
import { getProtocolMetrics, getProtocolSettMetrics, getProtocolTotalUsers } from './metrics.utils';

describe('metrics.utils', () => {
  beforeEach(() => {
    mockChainVaults();
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
    jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
      return fullTokenMockMap[tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
    });
    jest
      .spyOn(vaultUtils, 'getCachedVault')
      .mockImplementation(
        async (chain: Chain, VaultDefinition: VaultDefinitionModel): Promise<VaultDTO> =>
          vaultUtils.defaultVault(chain, VaultDefinition),
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
