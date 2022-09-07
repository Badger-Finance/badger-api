import { Currency } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { MOCK_VAULT_SNAPSHOT } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { VaultsService } from './vaults.service';
import * as vaultsUtils from './vaults.utils';

describe('vaults.service', () => {
  let service: VaultsService;
  let chain: Chain;

  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  beforeEach(() => {
    service = PlatformTest.get<VaultsService>(VaultsService);
    chain = setupMockChain();
    jest
      .spyOn(vaultsUtils, 'getCachedVault')
      .mockImplementation(async () => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel);
  });

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
