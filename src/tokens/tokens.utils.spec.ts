import { Currency, TokensService } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import * as priceUtils from '../prices/prices.utils';
import { MOCK_TOKENS, MOCK_VAULT_DEFINITION, TEST_TOKEN } from '../test/constants';
import { mockBalance, mockBatchGet, mockBatchPut, mockQuery, setupMockChain } from '../test/mocks.utils';
import * as vaultUtils from '../vaults/vaults.utils';
import { TokenNotFound } from './errors/token.error';
import { getFullToken, getFullTokens, getVaultTokens, toBalance } from './tokens.utils';

describe('token.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
    jest.spyOn(vaultUtils, 'getCachedVault').mockImplementation(async (chain: Chain, vault: VaultDefinitionModel) => {
      const defaultVault = await vaultUtils.defaultVault(chain, vault);
      defaultVault.balance = 10;
      return defaultVault;
    });
  });

  describe('toBalance', () => {
    describe('no requested currency', () => {
      it('converts to a usd based token balance', async () => {
        const badger = MOCK_TOKENS[TEST_TOKEN];
        const price = {
          address: badger.name,
          price: 8,
          updatedAt: Date.now(),
        };
        jest.spyOn(priceUtils, 'queryPrice').mockImplementationOnce(async (_contract) => price);
        const actual = await toBalance(badger, 10);
        const expected = {
          name: badger.name,
          address: badger.address,
          symbol: badger.symbol,
          decimals: badger.decimals,
          balance: 10,
          value: 80,
        };
        expect(actual).toEqual(expected);
      });
    });

    describe('with a requested currency', () => {
      it.each([Currency.USD, Currency.ETH])('converts to an %s based token balance', async (currency) => {
        const basePrice = 8;
        const convertedPrice = currency === Currency.ETH ? (basePrice * 8) / 3 : basePrice;
        const baseTokens = 10;
        const expectedValue = convertedPrice * baseTokens;
        const badger = MOCK_TOKENS[TEST_TOKEN];
        jest.spyOn(priceUtils, 'queryPrice').mockImplementation(async (token: string) => ({
          address: token,
          price: convertedPrice,
          updatedAt: Date.now(),
        }));
        const actual = await toBalance(badger, baseTokens, currency);
        const expected = {
          name: badger.name,
          address: badger.address,
          symbol: badger.symbol,
          decimals: badger.decimals,
          balance: baseTokens,
          value: expectedValue,
        };
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('mockBalance', () => {
    describe('no requested currency', () => {
      it('converts to a usd based token balance', () => {
        const badger = MOCK_TOKENS[TEST_TOKEN];
        const mockPrice = parseInt(badger.address.slice(0, 5), 16);
        const actual = mockBalance(badger, 1);
        const expected = {
          name: badger.name,
          address: badger.address,
          symbol: badger.symbol,
          decimals: badger.decimals,
          balance: 1,
          value: mockPrice,
        };
        expect(actual).toEqual(expected);
      });
    });

    describe('with a requested currency', () => {
      it.each([Currency.USD, Currency.ETH])('converts to an %s based token balance', (currency) => {
        const badger = MOCK_TOKENS[TEST_TOKEN];
        let mockPrice = parseInt(badger.address.slice(0, 5), 16);
        if (currency !== Currency.USD) {
          mockPrice /= 2;
        }
        const actual = mockBalance(badger, 1, currency);
        const expected = {
          name: badger.name,
          address: badger.address,
          symbol: badger.symbol,
          decimals: badger.decimals,
          balance: 1,
          value: mockPrice,
        };
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('getVaultTokens', () => {
    describe('no saved balances', () => {
      it('returns single token underlying balance', async () => {
        const badger = MOCK_TOKENS[TEST_TOKEN];
        const expected = mockBalance(badger, 10);
        mockQuery([{ vault: MOCK_VAULT_DEFINITION.address, tokenBalances: [expected] }]);
        const dto = await vaultUtils.defaultVault(chain, MOCK_VAULT_DEFINITION);
        const result = await getVaultTokens(chain, dto);
        expect(result).toMatchObject([expected]);
      });
    });

    describe('saved balances', () => {
      describe('no requested currency', () => {
        it('converts to a usd based token balance', async () => {
          const wbtc = MOCK_TOKENS[TOKENS.WBTC];
          const weth = MOCK_TOKENS[TOKENS.WETH];
          const dto = await vaultUtils.defaultVault(chain, MOCK_VAULT_DEFINITION);
          const tokenBalances = [mockBalance(wbtc, 1), mockBalance(weth, 20)];
          const cached = { vault: MOCK_VAULT_DEFINITION.address, tokenBalances };
          mockQuery([cached]);
          const actual = await getVaultTokens(chain, dto);
          expect(actual).toMatchObject(tokenBalances);
        });
      });

      describe('with a requested currency', () => {
        it.each([Currency.ETH, Currency.USD])('converts to an %s based token balance', async (currency) => {
          const wbtc = MOCK_TOKENS[TOKENS.WBTC];
          const weth = MOCK_TOKENS[TOKENS.WETH];
          const dto = await vaultUtils.defaultVault(chain, MOCK_VAULT_DEFINITION);
          const tokenBalances = [mockBalance(wbtc, 1), mockBalance(weth, 20)];
          const cached = { vault: MOCK_VAULT_DEFINITION.address, tokenBalances };
          mockQuery([cached]);
          const expected = [mockBalance(wbtc, 1, currency), mockBalance(weth, 20, currency)];
          const actual = await getVaultTokens(chain, dto, currency);
          expect(actual).toMatchObject(expected);
        });
      });
    });
  });

  describe('getFullToken(s)', () => {
    it('throws token not found', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = mockBatchGet([]);
      const sdkLoadMock = jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));

      await expect(getFullToken(chain, ethers.constants.AddressZero)).rejects.toThrow(TokenNotFound);

      expect(batchGetMock).toBeCalled();
      expect(sdkLoadMock).toBeCalled();
      expect(batchPutMock).toBeCalledTimes(0);
    });

    it('takes token from cache', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = mockBatchGet(Object.values(MOCK_TOKENS));
      const sdkLoadMock = jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));

      const token = await getFullToken(chain, TEST_TOKEN);

      expect(batchGetMock).toBeCalled();
      expect(sdkLoadMock).toBeCalledTimes(0);
      expect(batchPutMock).toBeCalledTimes(0);
      expect(token).toMatchObject(MOCK_TOKENS[TEST_TOKEN]);
    });

    it('takes token from sdk and saves it', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = mockBatchGet([]);
      const sdkLoadMock = jest
        .spyOn(TokensService.prototype, 'loadTokens')
        .mockImplementation(async () => ({ [TEST_TOKEN]: MOCK_TOKENS[TEST_TOKEN] }));

      const token = await getFullToken(chain, TEST_TOKEN);

      expect(batchGetMock).toBeCalled();
      expect(batchPutMock).toBeCalled();
      expect(sdkLoadMock).toBeCalled();
      expect(token).toMatchObject(MOCK_TOKENS[TEST_TOKEN]);
    });

    it('returns empty object', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = mockBatchGet([]);
      const sdkLoadMock = jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));

      const tokens = await getFullTokens(chain, [
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000001',
      ]);

      expect(batchGetMock).toBeCalled();
      expect(batchPutMock).toBeCalledTimes(0);
      expect(sdkLoadMock).toBeCalled();

      expect(tokens).toMatchObject({});
    });

    it('mixed cache and sdk get with save', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = mockBatchGet([MOCK_TOKENS[TEST_TOKEN], MOCK_TOKENS[TOKENS.WBTC]]);
      const sdkLoadMock = jest
        .spyOn(TokensService.prototype, 'loadTokens')
        .mockImplementation(async () => ({ [TOKENS.WETH]: MOCK_TOKENS[TOKENS.WETH] }));

      const expectedTokensMap = {
        [TEST_TOKEN]: MOCK_TOKENS[TEST_TOKEN],
        [TOKENS.WBTC]: MOCK_TOKENS[TOKENS.WBTC],
        [TOKENS.WETH]: MOCK_TOKENS[TOKENS.WETH],
      };

      const tokens = await getFullTokens(chain, [TEST_TOKEN, TOKENS.WBTC, TOKENS.WETH]);

      expect(batchGetMock).toBeCalled();
      expect(batchPutMock).toBeCalled();
      expect(sdkLoadMock).toBeCalled();

      expect(tokens).toMatchObject(expectedTokensMap);
    });
  });
});
