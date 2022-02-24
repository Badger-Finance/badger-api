import { PlatformTest } from '@tsed/common';
import { VaultsService } from './vaults.service';
import * as vaultsUtils from './vaults.utils';
import * as pricesUtils from '../prices/prices.utils';
import { Currency } from '@badger-dao/sdk';
import { TEST_CHAIN } from '../test/tests.utils';

describe('proofs.service', () => {
  let service: VaultsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<VaultsService>(VaultsService);
  });

  beforeEach(() => {
    jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (vault) => {
      const cachedVault = vaultsUtils.defaultVault(vault);
      cachedVault.value = Number(vault.vaultToken.slice(0, 6));
      cachedVault.balance = Number(vault.vaultToken.slice(0, 3));
      return cachedVault;
    });
    // TODO: implement pricing fixtures for test suites
    jest.spyOn(pricesUtils, 'convert').mockImplementation(async (price: number, currency?: Currency) => {
      if (currency === Currency.USD) {
        return price;
      }
      return (price * 8) / 3;
    });
  });

  afterEach(PlatformTest.reset);

  describe('getProtocolSummary', () => {
    describe('request with no currency', () => {
      it('returns the protocol summary in usd base currency', async () => {
        const result = await service.getProtocolSummary(TEST_CHAIN);
        expect(result).toMatchSnapshot();
      });
    });

    describe('request with currency', () => {
      it('returns the protocol summary in requested base currency', async () => {
        const result = await service.getProtocolSummary(TEST_CHAIN, Currency.AVAX);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
