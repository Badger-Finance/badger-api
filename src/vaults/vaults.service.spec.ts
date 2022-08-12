import { Currency } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import * as pricesUtils from '../prices/prices.utils';
import { setupMockChain } from '../test/mocks.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokenUtils from '../tokens/tokens.utils';
import { VaultsService } from './vaults.service';
import * as vaultsUtils from './vaults.utils';

describe('proofs.service', () => {
  let service: VaultsService;
  let chain: Chain;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<VaultsService>(VaultsService);
    chain = setupMockChain();
  });

  beforeEach(() => {
    jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
      return fullTokenMockMap[tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
    });
    jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (chain, vault) => {
      const cachedVault = await vaultsUtils.defaultVault(chain, vault);
      cachedVault.value = Number(vault.address.slice(0, 6));
      cachedVault.balance = Number(vault.address.slice(0, 3));
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
        const result = await service.getProtocolSummary(chain);
        expect(result).toMatchSnapshot();
      });
    });

    describe('request with currency', () => {
      it('returns the protocol summary in requested base currency', async () => {
        const result = await service.getProtocolSummary(chain, Currency.AVAX);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
