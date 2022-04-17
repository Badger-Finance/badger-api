import * as vaultsUtils from '../vaults/vaults.utils';
import { vaultHarvestsOnChainMock } from '../vaults/mocks/vault-harvests-on-chain';
import BadgerSDK from '@badger-dao/sdk';
import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { indexVaultsHarvestsCompund } from './harvest-compound-indexer';
import { Chain } from '../chains/config/chain.config';
import { HarvestCompoundData } from '../vaults/models/harvest-compound.model';

describe('harvest-compound.indexer', () => {
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;

  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();

    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    jest.spyOn(vaultsUtils, 'getLastCompoundHarvest').mockImplementation(async () => null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(vaultsUtils, 'getVaultHarvestsOnChain').mockImplementation(async (chain, vault, sdk, fromBlock) => {
      let onChainHarvests = vaultHarvestsOnChainMock[<string>vault];

      if (fromBlock) onChainHarvests = onChainHarvests.filter((harvest) => harvest.block > <number>fromBlock);

      return onChainHarvests;
    });

    jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();
    jest.spyOn(Chain.prototype, 'getSdk').mockImplementation();
  });

  describe('indexVaultsHarvestsCompund', () => {
    it('should save all harvests from all chains to ddb', async () => {
      await indexVaultsHarvestsCompund();

      expect(put.mock.calls.length).toBe(22);
    });

    it('should get and save harvests only after the block of the last in ddb', async () => {
      jest
        .spyOn(vaultsUtils, 'getLastCompoundHarvest')
        .mockImplementation(async () => <HarvestCompoundData>{ block: 13870247 });

      await indexVaultsHarvestsCompund();

      expect(put.mock.calls.length).toBe(2);
    });
  });
});
