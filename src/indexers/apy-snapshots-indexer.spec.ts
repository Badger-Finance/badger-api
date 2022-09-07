import { CachedYieldSource } from '../aws/models/cached-yield-source.interface';
import { Chain } from '../chains/config/chain.config';
import { MOCK_VAULT_DEFINITION } from '../test/constants';
import { mockBatchDelete, mockBatchPut, mockQuery, setupMockChain } from '../test/mocks.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { refreshChainApySnapshots } from './apy-snapshots-indexer';

describe('apy-snapshots-indexer', () => {
  let chain: Chain;

  const mockValueSource = Object.assign(new CachedYieldSource(), {
    addressValueSourceType: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305_flat_CVX_emission',
    address: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305',
    type: 'flat_CVX_emission',
    apr: 1,
    name: 'CVX Rewards',
    oneDay: 1,
    threeDay: 1,
    sevenDay: 1,
    thirtyDay: 1,
    harvestable: false,
    minApr: 1,
    maxApr: 1,
    boostable: false,
  });
  const mockInvalidValueSource = Object.assign(new CachedYieldSource(), {
    addressValueSourceType: null,
    address: null,
    type: null,
    apr: NaN,
    name: null,
    harvestable: false,
    minApr: null,
    maxApr: null,
    boostable: false,
  });

  beforeEach(() => {
    chain = setupMockChain();
    mockBatchDelete([mockValueSource]);
    mockQuery([mockValueSource]);
  });

  describe('refreshChainApySnapshots', () => {
    it('calls batchPut for valid value source', async () => {
      const batchPut = mockBatchPut([mockValueSource]);
      jest.spyOn(vaultsUtils, 'getVaultPerformance').mockReturnValue(Promise.resolve([mockValueSource]));
      await refreshChainApySnapshots(chain, MOCK_VAULT_DEFINITION);
      expect(batchPut.mock.calls[0][0]).toEqual([mockValueSource]);
      // Make sure was called for each sett in the chain
      const allChainVault = await chain.vaults.all();
      expect(batchPut.mock.calls.length).toEqual(allChainVault.length);
    });

    it('doesnt call batch put if value source invalid', async () => {
      const batchPut = mockBatchPut([mockInvalidValueSource]);
      jest.spyOn(vaultsUtils, 'getVaultPerformance').mockReturnValue(Promise.resolve([mockInvalidValueSource]));
      await refreshChainApySnapshots(chain, MOCK_VAULT_DEFINITION);
      expect(batchPut.mock.calls).toEqual([]);
    });
  });
});
