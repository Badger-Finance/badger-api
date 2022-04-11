import { BinanceSmartChain } from '../chains/config/bsc.config';
import { getTreeDistribution } from './rewards.utils';
import * as s3Utils from '../aws/s3.utils';
import { Ethereum } from '../chains/config/eth.config';
import { MOCK_DISTRIBUTION_FILE } from '../test/fixtures';

describe('rewards.utils', () => {
  describe('getTreeDistribution', () => {
    it('returns null for a chain with no badger tree', async () => {
      const distribution = await getTreeDistribution(new BinanceSmartChain());
      expect(distribution).toEqual(null);
    });

    it('returns the distribution file for the requested chain', async () => {
      jest.spyOn(s3Utils, 'getObject').mockImplementation(async () => JSON.stringify(MOCK_DISTRIBUTION_FILE));
      const distribution = await getTreeDistribution(new Ethereum());
      expect(distribution).toEqual(MOCK_DISTRIBUTION_FILE);
    });
  });
});
