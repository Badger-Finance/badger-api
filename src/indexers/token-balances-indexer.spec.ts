import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { updateTokenBalance } from './token-balances-indexer';
import { Ethereum } from '../chains/config/eth.config';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { TOKENS } from '../config/tokens.config';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';

describe('token-balances-indexer', () => {
  const chain = new Ethereum();
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;
  beforeEach(() => {
    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
  });
  describe('updateTokenBalance', () => {
    it('should not update for token without balance', async () => {
      await updateTokenBalance(chain, getVaultDefinition(chain, TOKENS.BDIGG));
      expect(put.mock.calls.length).toEqual(0);
    });
    it('should not update for lp token wihtout balance', async () => {
      await updateTokenBalance(
        chain,
        Object.assign({
          name: 'something',
          depositToken: TOKENS.CRV_HBTC,
        }),
      );
      expect(put.mock.calls.length).toEqual(0);
    });
    it('should update token with balance', async () => {
      await updateTokenBalance(
        chain,
        Object.assign({
          name: 'something',
          depositToken: TOKENS.CRV_HBTC,
          getTokenBalance: async () =>
            Object.assign(new CachedLiquidityPoolTokenBalance(), {
              id: '123',
              pairId: '123',
              protocol: 'some protocol',
              tokenBalances: [
                Object.assign(new CachedTokenBalance(), {
                  address: TOKENS.BCRV_HTBC,
                  name: 'BCRV_HBTC',
                  symbol: 'BCRVHBTC',
                  decimals: 18,
                  balance: 100000000,
                  valueEth: 1,
                  valueUsd: 10101010,
                }),
              ],
            }),
        }),
      );
      expect(put.mock.calls.length).toEqual(1);
    });
  });
});
