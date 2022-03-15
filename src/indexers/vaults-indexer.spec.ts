import { DataMapper } from '@aws/dynamodb-data-mapper';
import { indexProtocolVaults } from './vaults-indexer';
import * as indexerUtils from './indexer.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { randomSnapshot } from '../test/tests.utils';
import { VaultsService } from '../vaults/vaults.service';
import { defaultVault } from '../vaults/vaults.utils';
import { VaultSnapshot } from '@badger-dao/sdk';

describe('vaults-indexer', () => {
  const chains = loadChains();
  let vaultToSnapshot: jest.SpyInstance<Promise<VaultSnapshot>, [chain: Chain, VaultDefinition: VaultDefinition]>;
  beforeEach(() => {
    vaultToSnapshot = jest
      .spyOn(indexerUtils, 'vaultToSnapshot')
      .mockImplementation(async (_chain, vault) => randomSnapshot(vault));
    jest.spyOn(VaultsService, 'loadVault').mockImplementation(async (v) => defaultVault(v));
    jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
  });

  describe('indexProtocolVaults', () => {
    it('should call update price for all tokens', async () => {
      await indexProtocolVaults();
      let vaultCount = 0;
      chains.forEach((chain) => {
        chain.vaults.forEach((_v) => {
          vaultCount++;
        });
      });
      expect(vaultToSnapshot.mock.calls.length).toEqual(vaultCount);
    });
  });
});
