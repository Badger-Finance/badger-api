import { PlatformTest } from '@tsed/common';

import { setupChainGasPrices, TEST_CHAIN } from '../test/tests.utils';
import { GasService } from './gas.service';

describe('GasService', () => {
  let service: GasService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<GasService>(GasService);
  });

  afterAll(PlatformTest.reset);

  describe('getGasPrices', () => {
    it('returns gas prices for a chain', async () => {
      setupChainGasPrices();
      const gasPrices = await service.getGasPrices(TEST_CHAIN);
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
