import { Network } from '@badger-dao/sdk';

import { Chain } from '../chains/config/chain.config';
import { MOCK_DISTRIBUTION_FILE } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { getTreeDistribution } from './rewards.utils';

describe('rewards.utils', () => {
  let chain: Chain;

  describe('getTreeDistribution', () => {
    it('returns null for a chain with no badger tree', async () => {
      chain = setupMockChain({ network: Network.Arbitrum });
      const distribution = await getTreeDistribution(chain);
      expect(distribution).toEqual(null);
    });

    it('returns the distribution file for the requested chain', async () => {
      chain = setupMockChain();
      const distribution = await getTreeDistribution(chain);
      expect(distribution).toEqual(MOCK_DISTRIBUTION_FILE);
    });
  });
});
