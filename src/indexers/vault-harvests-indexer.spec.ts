import { DataMapper } from '@aws/dynamodb-data-mapper';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { MOCK_VAULT_DEFINITION, MOCK_YIELD_EVENT } from '../test/constants';
import { mockBatchPut, setupMockChain } from '../test/mocks.utils';
import * as harvestsUtils from '../vaults/harvests.utils';
import { updateVaultHarvests } from './vault-harvests-indexer';

describe('vault-harvests-indexer', () => {
  let chain: Chain;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();

    chain = setupMockChain();
  });

  describe('updateVaultHarvests', () => {
    describe('vault has recent harvests', () => {
      it('persists new harvests', async () => {
        mockBatchPut([]);
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
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

    describe('vault has recent harvests and encounters and update error', () => {
      it('does not update any metadata information', async () => {
        mockBatchPut([]);
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation(() => {
          throw new Error('Expected test error: put');
        });
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

    describe('vault has no recent harvests', () => {
      it('updates the last harvested block', async () => {
        const batchPut = mockBatchPut([]);
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        jest.spyOn(harvestsUtils, 'loadYieldEvents').mockImplementation(async () => []);
        await updateVaultHarvests();
        // verify we did not try to update yield events
        expect(batchPut.mock.calls.length).toEqual(0);
      });
    });

    describe('vault has no recent harvests and encounters an update error', () => {
      it('does not update any information', async () => {
        const batchPut = mockBatchPut([]);
        jest.spyOn(DataMapper.prototype, 'put').mockImplementation(() => {
          throw new Error('Expected test error: put');
        });
        jest.spyOn(harvestsUtils, 'loadYieldEvents').mockImplementation(async () => []);
        await updateVaultHarvests();
        // verify we did not try to update yield events
        expect(batchPut.mock.calls.length).toEqual(0);
      });
    });
  });
});
