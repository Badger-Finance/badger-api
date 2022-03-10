import { DataMapper } from '@aws/dynamodb-data-mapper';
import { indexProtocolVaults } from './vaults-indexer';
import * as indexerUtils from './indexer.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { IVaultSnapshot } from '../vaults/interfaces/vault-snapshot.interface';
import { TEST_ADDR } from '../test/tests.utils';

describe('vaults-indexer', () => {
  const chains = loadChains();
  let vaultToSnapshot: jest.SpyInstance<Promise<IVaultSnapshot>, [chain: Chain, VaultDefinition: VaultDefinition]>;
  beforeEach(() => {
    vaultToSnapshot = jest.spyOn(indexerUtils, 'vaultToSnapshot').mockImplementation(async (_chain, vault) => ({
      address: vault.vaultToken,
      block: 100,
      timestamp: 123123123123,
      balance: 13,
      totalSupply: 13,
      pricePerFullShare: 12,
      value: 1000,
      strategy: {
        address: TEST_ADDR,
        strategistFee: 10,
        performanceFee: 10,
        withdrawFee: 10,
      },
      available: 13,
      boostWeight: 3500,
    }));
    // Always throw because we need to exit infinite loop
    jest.spyOn(DataMapper.prototype, 'put').mockImplementation(() => {
      throw new Error();
    });
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
