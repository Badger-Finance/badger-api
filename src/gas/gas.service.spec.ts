import { PlatformTest } from '@tsed/common';

import { Ethereum } from '../chains/config/eth.config';
import { setupChainGasPrices } from '../test/tests.utils';
import { GasService } from './gas.service';

describe('GasService', () => {
  const chain = new Ethereum();
  let service: GasService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<GasService>(GasService);
  });

  afterAll(PlatformTest.reset);

  describe('getGasPrices', () => {
    it('returns gas prices for a chain', async () => {
      setupChainGasPrices();
      const gasPrices = await service.getGasPrices(chain);
      expect(gasPrices).toMatchObject({
        fast: {
          maxFeePerGas: expect.any(Number),
          maxPriorityFeePerGas: expect.any(Number),
        },
        rapid: {
          maxFeePerGas: expect.any(Number),
          maxPriorityFeePerGas: expect.any(Number),
        },
        slow: {
          maxFeePerGas: expect.any(Number),
          maxPriorityFeePerGas: expect.any(Number),
        },
        standard: {
          maxFeePerGas: expect.any(Number),
          maxPriorityFeePerGas: expect.any(Number),
        },
      });
    });
  });
});
