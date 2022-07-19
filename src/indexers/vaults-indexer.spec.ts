import { DataMapper } from '@aws/dynamodb-data-mapper';
import { VaultSnapshot } from '@badger-dao/sdk';

import { SUPPORTED_CHAINS } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import * as chartUtils from '../charts/charts.utils';
import { TOKENS } from '../config/tokens.config';
import { randomSnapshot } from '../test/tests.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokenUtils from '../tokens/tokens.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { VaultsService } from '../vaults/vaults.service';
import { defaultVault } from '../vaults/vaults.utils';
import * as indexerUtils from './indexer.utils';
import { indexProtocolVaults } from './vaults-indexer';

describe('vaults-indexer', () => {
  let vaultToSnapshot: jest.SpyInstance<Promise<VaultSnapshot>, [chain: Chain, VaultDefinition: VaultDefinition]>;
  beforeEach(() => {
    vaultToSnapshot = jest
      .spyOn(indexerUtils, 'vaultToSnapshot')
      .mockImplementation(async (_chain, vault) => randomSnapshot(vault));
    jest.spyOn(VaultsService, 'loadVault').mockImplementation(async (c, v) => defaultVault(c, v));
    jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    // just mock, to prevent dramatic amount of console output
    // will be refactored, when old vault historic data be removed
    jest.spyOn(chartUtils, 'updateSnapshots').mockImplementation();
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
