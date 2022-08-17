import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';

import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { getSupportedChains } from '../chains/chains.utils';
import { MOCK_VAULT_DEFINITION } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import * as vaultsUtils from '../vaults/harvests.utils';
import { vaultHarvestsOnChainMock } from '../vaults/mocks/vault-harvests-on-chain';
import { indexVaultsHarvestsCompund } from './harvest-compound-indexer';

describe('harvest-compound.indexer', () => {
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;

  beforeEach(() => {
    setupMockChain();
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();

    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    jest.spyOn(vaultsUtils, 'getLastCompoundHarvest').mockImplementation(async () => null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(vaultsUtils, 'getVaultHarvestsOnChain').mockImplementation(async (_c, vault, fromBlock) => {
      let onChainHarvests = vaultHarvestsOnChainMock[<string>vault];

      if (fromBlock) {
        onChainHarvests = onChainHarvests.filter((harvest) => harvest.block > <number>fromBlock);
      }

      return onChainHarvests;
    });
  });

  describe('indexVaultsHarvestsCompund', () => {
    it('should save all harvests from all chains to ddb', async () => {
      await indexVaultsHarvestsCompund();
      expect(put.mock.calls.length).toBe(
        getSupportedChains().length * vaultHarvestsOnChainMock[MOCK_VAULT_DEFINITION.address].length,
      );
    });

    it('should get and save harvests only after the block of the last in ddb', async () => {
      const blocks = vaultHarvestsOnChainMock[MOCK_VAULT_DEFINITION.address].map((h) => h.block).sort();
      const cutoffBlock = blocks[1];
      const conformingHarvests = vaultHarvestsOnChainMock[MOCK_VAULT_DEFINITION.address].filter(
        (h) => h.block > cutoffBlock,
      );
      jest
        .spyOn(vaultsUtils, 'getLastCompoundHarvest')
        .mockImplementation(async () => <HarvestCompoundData>{ block: cutoffBlock });

      await indexVaultsHarvestsCompund();

      // mock data intentionally includes
      expect(put.mock.calls.length).toBe(getSupportedChains().length * conformingHarvests.length);
    });
  });
});
