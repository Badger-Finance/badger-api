import { setupChainGasPrices, TEST_CHAIN } from '../test/tests.utils';
import * as gasUtils from './gas.utils';

describe('gas.utils', () => {
  beforeEach(setupChainGasPrices);
  describe('getGasPrices', () => {
    it('returns gas prices for all networks', async () => {
      const gasPrices = await gasUtils.getGasCache([TEST_CHAIN]);
      expect(gasPrices).toMatchSnapshot();
    });
  });
});
