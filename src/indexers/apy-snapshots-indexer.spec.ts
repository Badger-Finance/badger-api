import { refreshChainApySnapshots } from './apy-snapshots-indexer';
import { Ethereum } from '../chains/config/eth.config';
import * as rewardsUtils from '../rewards/rewards.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { mockBatchPut } from '../test/tests.utils';

describe('apy-snapshots-indexer', () => {
  const chain = new Ethereum();
  const mockSett = Object.assign(new CachedValueSource(), {
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
  const mockInvalidSett = Object.assign(new CachedValueSource(), {
    addressValueSourceType: null,
    address: null,
    type: null,
    apr: NaN,
    name: null,
    oneDay: null,
    threeDay: null,
    sevenDay: null,
    thirtyDay: null,
    harvestable: false,
    minApr: null,
    maxApr: null,
    boostable: false,
  });
  describe('refreshChainApySnapshots', () => {
    it('calls batchPut for valid value source', async () => {
      const batchPut = mockBatchPut([mockSett]);
      jest.spyOn(rewardsUtils, 'getVaultValueSources').mockReturnValue(Promise.resolve([mockSett]));
      await refreshChainApySnapshots(chain);
      expect(batchPut.mock.calls[0][0]).toEqual([mockSett]);
      // Make sure was called for each sett in the chain
      expect(batchPut.mock.calls.length).toEqual(chain.setts.length);
    });
    it('doesnt call batch put if value source invalid', async () => {
      const batchPut = mockBatchPut([mockInvalidSett]);
      jest.spyOn(rewardsUtils, 'getVaultValueSources').mockReturnValue(Promise.resolve([mockInvalidSett]));
      await refreshChainApySnapshots(chain);
      expect(batchPut.mock.calls).toEqual([]);
    });
  });
});
