import { DataMapper } from '@aws/dynamodb-data-mapper';
import { indexProtocolVaults } from './vaults-indexer';
import * as indexerUtils from './indexer.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { Chain } from '../chains/config/chain.config';
import { randomSnapshot } from '../test/tests.utils';
import { VaultsService } from '../vaults/vaults.service';
import { defaultVault } from '../vaults/vaults.utils';
import * as tokenUtils from '../tokens/tokens.utils';
import { VaultSnapshot } from '@badger-dao/sdk';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { TOKENS } from '../config/tokens.config';
import { SUPPORTED_CHAINS } from '../chains/chain';

describe('vaults-indexer', () => {
  let vaultToSnapshot: jest.SpyInstance<Promise<VaultSnapshot>, [chain: Chain, VaultDefinition: VaultDefinition]>;
  beforeEach(() => {
    vaultToSnapshot = jest
      .spyOn(indexerUtils, 'vaultToSnapshot')
      .mockImplementation(async (_chain, vault) => randomSnapshot(vault));
    jest.spyOn(VaultsService, 'loadVault').mockImplementation(async (c, v) => defaultVault(c, v));
    jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
  });

  describe('indexProtocolVaults', () => {
    it('should call update price for all tokens', async () => {
      jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
        return fullTokenMockMap[<string>tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
      });
      await indexProtocolVaults();
      let vaultCount = 0;
      SUPPORTED_CHAINS.forEach((chain) => {
        chain.vaults.forEach((_v) => {
          vaultCount++;
        });
      });
      expect(vaultToSnapshot.mock.calls.length).toEqual(vaultCount);
    });
  });
});
