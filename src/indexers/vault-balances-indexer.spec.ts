import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { Chain } from '../chains/config/chain.config';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { MOCK_VAULT_DEFINITION } from '../test/constants';
import { setFullTokenDataMock, TEST_ADDR } from '../test/tests.utils';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import * as indexerUtils from './indexer.utils';
import { updateVaultTokenBalances } from './vault-balances-indexer';

describe('vault-balances-indexer', () => {
  const chain = new Ethereum();
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;
  beforeEach(() => {
    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
  });
  describe('updateVaultTokenBalances', () => {
    it('should not update for token without balance', async () => {
      setFullTokenDataMock();
      await updateVaultTokenBalances(chain, MOCK_VAULT_DEFINITION);
      expect(put.mock.calls.length).toEqual(0);
    });
    it('should not update for lp token wihtout balance', async () => {
      setFullTokenDataMock();
      await updateVaultTokenBalances(
        chain,
        Object.assign({
          name: 'something',
          depositToken: TOKENS.BADGER,
        }),
      );
      expect(put.mock.calls.length).toEqual(0);
    });
    it('should throw if lptoken and token balance', async () => {
      console.error = jest.fn();
      setFullTokenDataMock();
      await updateVaultTokenBalances(
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
      setFullTokenDataMock();
      await updateVaultTokenBalances(
        chain,
        Object.assign({
          name: 'something',
          depositToken: TOKENS.BADGER,
          getTokenBalance: async () =>
            Object.assign(new VaultTokenBalance(), {
              vault: TEST_ADDR,
              tokenBalances: [
                Object.assign(new CachedTokenBalance(), {
                  address: TOKENS.BBADGER,
                  name: 'BCRV_HBTC',
                  symbol: 'BCRVHBTC',
                  decimals: 18,
                  balance: 100000000,
                  value: 1,
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
        .mockImplementation(async (_chain: Chain, _vault: VaultDefinitionModel) => {
          return Object.assign(new VaultTokenBalance(), {
            vault: TEST_ADDR,
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
      setFullTokenDataMock();
      await updateVaultTokenBalances(
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
        .mockImplementation(async (_chain: Chain, _vault: VaultDefinitionModel) => {
          return Object.assign(new VaultTokenBalance(), {
            vault: TEST_ADDR,
            tokenBalances: [],
          });
        });
      setFullTokenDataMock();
      await updateVaultTokenBalances(
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
