import { getVaultEntityId } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { MOCK_VAULT_DEFINITION, MOCK_YIELD_EVENT } from '../test/constants';
import { mockBatchPut, setupMockChain } from '../test/mocks.utils';
import * as harvestsUtils from '../vaults/harvests.utils';
import { updateVaultHarvests } from './vault-harvests-indexer';

describe('vault-harvests-indexer', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  describe('updateVaultHarvests', () => {
    describe('vault has recent harvests', () => {
      it('persists new harvests', async () => {
        mockBatchPut([]);
        jest.spyOn(harvestsUtils, 'loadYieldEvents').mockImplementation(async () => [
          {
            id: getVaultEntityId(chain, MOCK_VAULT_DEFINITION),
            chain: chain.network,
            vault: MOCK_VAULT_DEFINITION.address,
            ...MOCK_YIELD_EVENT,
          },
        ]);
        await updateVaultHarvests();
      });
    });
  });
});
