import * as accountsUtils from '../accounts/accounts.utils';
import { Chain } from '../chains/config/chain.config';
import { MOCK_VAULT, TEST_ADDR, TEST_TOKEN } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { getChainMetrics } from './metrics.utils';

describe('metrics.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
    jest.spyOn(accountsUtils, 'getAccounts').mockImplementation(async (_c) => [TEST_ADDR, TEST_TOKEN]);
    jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async () => MOCK_VAULT);
  });

  describe('getChainMetrics', () => {
    it('returns total users, value, and vaults for all requested chains', async () => {
      const metrics = await getChainMetrics([chain]);
      expect(metrics).toMatchSnapshot();
    });
  });
});
