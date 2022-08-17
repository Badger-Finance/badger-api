import { BadgerGraph, gqlGenT, VaultsService } from '@badger-dao/sdk';

import { Chain } from '../chains/config/chain.config';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { getVaultHarvestsOnChain } from './harvests.utils';
import { vaultsGraphSdkMapMock } from './mocks/vaults-graph-sdk-map.mock';
import { vaultsHarvestsSdkMock } from './mocks/vaults-harvests-sdk.mock';

describe('vaults.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  describe('getVaultHarvestsOnChain', () => {
    function setupOnChainHarvests() {
      // eslint-disable-next-line
      jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async ({ address }): Promise<any> => {
        return vaultsHarvestsSdkMock[address];
      });
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      jest
        .spyOn(BadgerGraph.prototype, 'loadSett')
        .mockImplementation(async ({ id, block }): Promise<gqlGenT.SettQuery> => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return vaultsGraphSdkMapMock[`${id.toLowerCase()}-${(block || {}).number || 0}`];
        });
    }

    it('returns vaults harvests with apr', async () => {
      setupOnChainHarvests();
      expect(await getVaultHarvestsOnChain(chain, TEST_ADDR)).toMatchSnapshot();
    });

    it('returns empty harvests for unknown vault', async () => {
      setupOnChainHarvests();
      jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => {
        throw new Error('Missing Vault');
      });
      await expect(getVaultHarvestsOnChain(chain, '0x000000000000')).rejects.toThrow(Error);
    });
  });
});
