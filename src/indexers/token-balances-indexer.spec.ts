import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { updateTokenBalance } from './token-balances-indexer';
import { Ethereum } from '../chains/config/eth.config';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { TOKENS } from '../config/tokens.config';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import * as indexerUtils from './indexer.utils';
import { Chain } from '../chains/config/chain.config';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';

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
    it('should throw if lptoken and token balance', async () => {
      console.error = jest.fn();
      await updateTokenBalance(
        chain,
        Object.assign({
          name: 'something',
          depositToken: TOKENS.SUSHI_BADGER_WBTC,
          getTokenBalance: async () => {
            return 1;
          },
        }),
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(console.error.mock.calls[0][0].err.name).toEqual('UNPROCESSABLE_ENTITY');
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
    it('should update lptoken', async () => {
      const lpBalance = jest
        .spyOn(indexerUtils, 'getLpTokenBalances')
        .mockImplementation(async (chain: Chain, sett: VaultDefinition) => {
          return Object.assign(new CachedLiquidityPoolTokenBalance(), {
            id: '123',
            pairId: '123',
            protocol: 'some protocol',
            tokenBalances: [
              Object.assign(new CachedTokenBalance(), {
                address: TOKENS.BCRV_HTBC,
                name: 'SUSHI_BADGER_WBTC',
                symbol: 'SUSHI_BADGER_WBTC',
                decimals: 18,
                balance: 100000000,
                valueEth: 1,
                valueUsd: 10101010,
              }),
            ],
          });
        });
      await updateTokenBalance(
        chain,
        Object.assign({
          name: 'something',
          depositToken: TOKENS.SUSHI_BADGER_WBTC,
        }),
      );
      expect(put.mock.calls.length).toEqual(1);
      expect(lpBalance.mock.calls.length).toEqual(1);
    });
    it('should not update lptoken no balance', async () => {
      const lpBalance = jest
        .spyOn(indexerUtils, 'getLpTokenBalances')
        .mockImplementation(async (chain: Chain, sett: VaultDefinition) => {
          return Object.assign(new CachedLiquidityPoolTokenBalance(), {
            id: '123',
            pairId: '123',
            protocol: 'some protocol',
            tokenBalances: [],
          });
        });
      await updateTokenBalance(
        chain,
        Object.assign({
          name: 'something',
          depositToken: TOKENS.SUSHI_BADGER_WBTC,
        }),
      );
      expect(put.mock.calls.length).toEqual(0);
      expect(lpBalance.mock.calls.length).toEqual(1);
    });
  });
});
