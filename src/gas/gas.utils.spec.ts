import { TestChain } from '../chains/config/test-chain.config';
import * as gasUtils from './gas.utils';

describe('gas.utils', () => {
  describe('getGasPrices', () => {
    it('returns gas prices for all networks', async () => {
      jest.spyOn(TestChain.prototype, 'getGasPrices').mockImplementation(async () => ({
        rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
        fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
        standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
        slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 },
      }));
      const chain = new TestChain();
      const gasPrices = await gasUtils.getGasCache([chain]);
      expect(gasPrices).toMatchSnapshot();
    });
  });
});
