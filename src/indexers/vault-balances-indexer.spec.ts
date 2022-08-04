import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';

import { Ethereum } from '../chains/config/eth.config';
import { MOCK_VAULT_DEFINITION } from '../test/constants';
import { mockChainVaults, randomSnapshot, setFullTokenDataMock, setupMapper } from '../test/tests.utils';
import { updateVaultTokenBalances } from './vault-balances-indexer';

describe('vault-balances-indexer', () => {
  const chain = new Ethereum();
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;

  beforeEach(() => {
    mockChainVaults();
    setFullTokenDataMock();
    setupMapper([randomSnapshot(MOCK_VAULT_DEFINITION)]);
    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
  });

  describe('updateVaultTokenBalances', () => {
    it('should update token with balance', async () => {
      await updateVaultTokenBalances(chain, MOCK_VAULT_DEFINITION);
      expect(put.mock.calls.length).toEqual(1);
    });
  });
});
