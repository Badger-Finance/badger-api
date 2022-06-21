import * as s3Utils from '../aws/s3.utils';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { MOCK_DISTRIBUTION_FILE } from '../test/constants';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { getTreeDistribution, noRewards } from './rewards.utils';

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

  describe('noRewards', () => {
    it('returns a cached value source for a flat emission, zero apr token rewards', async () => {
      const token = fullTokenMockMap[TOKENS.CVX];
      const vault = getVaultDefinition(new Ethereum(), TOKENS.BVECVX);
      const cachedValueSource = await noRewards(vault, token);
      expect(cachedValueSource).toMatchObject({
        addressValueSourceType: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305_flat_CVX_emission',
        address: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305',
        type: 'flat_CVX_emission',
        apr: 0,
        name: 'CVX Rewards',
        minApr: 0,
        maxApr: 0,
        boostable: false,
      });
    });
  });
});
