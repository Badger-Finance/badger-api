import { getVaultEntityId } from '../aws/dynamodb.utils';
import { CachedYieldSource } from '../aws/models/cached-yield-source.interface';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { MOCK_VAULT_DEFINITION } from '../test/constants';
import { mockBatchDelete, mockBatchPut, mockQuery, setupMockChain } from '../test/mocks.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { refreshChainApySnapshots } from './apy-snapshots-indexer';

describe('apy-snapshots-indexer', () => {
  let chain: Chain;
  let mockValueSourceEntity: CachedYieldSource;
  let mockInvalidValueSource: CachedYieldSource;

  beforeEach(() => {
    chain = setupMockChain();

    const mockYieldSource: CachedYieldSource = {
      id: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305_flat_CVX_emission',
      address: TOKENS.BVECVX,
      chainAddress: getVaultEntityId(chain, { address: TOKENS.BVECVX }),
      type: SourceType.Emission,
      chain: chain.network,
      performance: {
        baseYield: 1,
        minYield: 0.5,
        maxYield: 2,
        grossYield: 1.15,
        minGrossYield: 0.8,
        maxGrossYield: 2.3,
      },
      name: 'CVX Rewards',
      boostable: false,
    };
    mockValueSourceEntity = Object.assign(new CachedYieldSource(), mockYieldSource);

    // purposefully using this assignment to be able to assign bad values to object
    mockInvalidValueSource = Object.assign(new CachedYieldSource(), {
      id: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305_flat_CVX_emission',
      address: TOKENS.BVECVX,
      chainAddress: getVaultEntityId(chain, { address: TOKENS.BVECVX }),
      type: SourceType.Emission,
      chain: chain.network,
      performance: {
        baseYield: NaN,
        minYield: null,
        maxYield: null,
        grossYield: NaN,
        minGrossYield: NaN,
        maxGrossYield: null,
      },
      name: 'CVX Rewards',
      boostable: false,
    });

    mockBatchDelete([mockValueSourceEntity]);
    mockQuery([mockValueSourceEntity]);
  });

  describe('refreshChainApySnapshots', () => {
    it('calls batchPut for valid value source', async () => {
      const batchPut = mockBatchPut([mockValueSourceEntity]);
      jest.spyOn(vaultsUtils, 'getVaultPerformance').mockImplementation(async () => [mockValueSourceEntity]);
      await refreshChainApySnapshots(chain, MOCK_VAULT_DEFINITION);
      expect(batchPut.mock.calls[0][0]).toEqual([mockValueSourceEntity]);
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
