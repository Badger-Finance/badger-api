import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';

import { Chain } from '../chains/config/chain.config';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION } from '../test/constants';
import { mockQuery, randomSnapshot, setupMockChain } from '../test/mocks.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { updateVaultTokenBalances } from './vault-balances-indexer';

describe('vault-balances-indexer', () => {
  let chain: Chain;
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;

  beforeEach(() => {
    chain = setupMockChain();
    mockQuery([randomSnapshot(MOCK_VAULT_DEFINITION)]);
    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
    jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async () => MOCK_VAULT);
  });

  describe('updateVaultTokenBalances', () => {
    it('should update token with balance', async () => {
      await updateVaultTokenBalances(chain, MOCK_VAULT_DEFINITION);
      expect(put.mock.calls.length).toEqual(1);
    });
  });
});
