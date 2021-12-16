import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { updateTokenBalance } from './token-balances-indexer';
import { Ethereum } from '../chains/config/eth.config';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { TOKENS } from '../config/tokens.config';

describe('token-balances-indexer', () => {
  const chain = new Ethereum();
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;
  beforeEach(() => {
    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
  });
  describe('updateTokenBalance', () => {
    it('should not update anything for token without balance', async () => {
      await updateTokenBalance(chain, getVaultDefinition(chain, TOKENS.BDIGG));
      expect(put.mock.calls.length).toEqual(0);
    });
  });
});
