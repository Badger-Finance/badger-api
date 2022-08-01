import BadgerSDK, { Currency, TokensService, TokenValue } from '@badger-dao/sdk';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import * as priceUtils from '../prices/prices.utils';
import { MOCK_VAULT_DEFINITION } from '../test/constants';
import {
  mockBatchPut,
  mockPricing,
  setFullTokenDataMock,
  setupBatchGet,
  setupMapper,
  TEST_ADDR,
  TEST_CHAIN,
} from '../test/tests.utils';
import * as vaultUtils from '../vaults/vaults.utils';
import { TokenNotFound } from './errors/token.error';
import { fullTokenMockMap } from './mocks/full-token.mock';
import {
  getCachedTokenBalances,
  getFullToken,
  getFullTokens,
  getVaultTokens,
  mockBalance,
  toBalance,
} from './tokens.utils';

describe('token.utils', () => {
  beforeEach(() => {
    jest.spyOn(vaultUtils, 'getCachedVault').mockImplementation(async (chain: Chain, vault: VaultDefinitionModel) => {
      setFullTokenDataMock();
      const defaultVault = await vaultUtils.defaultVault(chain, vault);
      defaultVault.balance = 10;
      return defaultVault;
    });
    mockPricing();
    jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();
  });

  describe('toBalance', () => {
    describe('no requested currency', () => {
      it('converts to a usd based token balance', async () => {
        const badger = fullTokenMockMap[TOKENS.BADGER];
        const price = {
          address: badger.name,
          price: 8,
          updatedAt: Date.now(),
        };
        jest.spyOn(priceUtils, 'getPrice').mockImplementationOnce(async (_contract) => price);
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
        const badger = fullTokenMockMap[TOKENS.BADGER];
        jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (token: string) => ({
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
        const badger = fullTokenMockMap[TOKENS.BADGER];
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
        const badger = fullTokenMockMap[TOKENS.BADGER];
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

  describe('getCachedTokenBalances', () => {
    describe('no saved balances', () => {
      it('returns single token underlying balance', async () => {
        setupMapper([]);
        setFullTokenDataMock();
        const dto = await vaultUtils.defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
        const result = await getCachedTokenBalances(TEST_CHAIN, dto);
        const token = fullTokenMockMap[dto.underlyingToken];
        const expected: TokenValue = {
          address: token.address,
          name: token.name,
          decimals: token.decimals,
          symbol: token.symbol,
          balance: 0,
          value: 0,
        };
        expect(result).toMatchObject([expected]);
      });
    });

    describe('saved balances', () => {
      describe('no requested currency', () => {
        it('converts to a usd based token balance', async () => {
          const wbtc = fullTokenMockMap[TOKENS.WBTC];
          const weth = fullTokenMockMap[TOKENS.WETH];
          setFullTokenDataMock();
          const dto = await vaultUtils.defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
          const tokenBalances = [mockBalance(wbtc, 1), mockBalance(weth, 20)];
          const cached = { vault: MOCK_VAULT_DEFINITION.address, tokenBalances };
          setupMapper([cached]);
          const actual = await getCachedTokenBalances(TEST_CHAIN, dto);
          expect(actual).toMatchObject(tokenBalances);
        });
      });

      describe('with a requested currency', () => {
        it.each([Currency.ETH, Currency.USD])('converts to an %s based token balance', async (currency) => {
          const wbtc = fullTokenMockMap[TOKENS.WBTC];
          const weth = fullTokenMockMap[TOKENS.WETH];
          setFullTokenDataMock();
          const dto = await vaultUtils.defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
          const tokenBalances = [mockBalance(wbtc, 1), mockBalance(weth, 20)];
          const cached = { vault: MOCK_VAULT_DEFINITION.address, tokenBalances };
          setupMapper([cached]);
          const expected = [mockBalance(wbtc, 1, currency), mockBalance(weth, 20, currency)];
          const actual = await getCachedTokenBalances(TEST_CHAIN, dto, currency);
          expect(actual).toMatchObject(expected);
        });
      });
    });
  });

  describe('getVaultTokens', () => {
    it('returns the single token for a non liquidity token underlying token', async () => {
      setFullTokenDataMock();
      setupMapper([]);
      mockPricing();
      const dto = await vaultUtils.defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
      dto.balance = 10;
      const tokens = await getVaultTokens(TEST_CHAIN, dto, 10);
      expect(tokens).toMatchSnapshot();
    });

    it('returns all deposit token for a liquidity token underlying token', async () => {
      const wbtc = fullTokenMockMap[TOKENS.WBTC];
      const weth = fullTokenMockMap[TOKENS.WETH];

      const tokenBalances = await Promise.all([toBalance(wbtc, 1), toBalance(weth, 20)]);
      const cached = { vault: TEST_ADDR, tokenBalances };
      setupMapper([cached]);

      setFullTokenDataMock();
      const dto = await vaultUtils.defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
      dto.balance = 10;
      const tokens = await getVaultTokens(TEST_CHAIN, dto, 10);
      expect(tokens).toMatchSnapshot();
    });
  });

  describe('getFullToken(s)', () => {
    it('throws token not found', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = setupBatchGet([]);
      const sdkLoadMock = jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));

      await expect(getFullToken(TEST_CHAIN, '0x0000000000000000000000000000000000000000')).rejects.toThrow(
        TokenNotFound,
      );

      expect(batchGetMock).toBeCalled();
      expect(sdkLoadMock).toBeCalled();
      expect(batchPutMock).toBeCalledTimes(0);
    });
    it('takes token from cache', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = setupBatchGet(Object.values(fullTokenMockMap));
      const sdkLoadMock = jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));

      const token = await getFullToken(TEST_CHAIN, TOKENS.BADGER);

      expect(batchGetMock).toBeCalled();
      expect(sdkLoadMock).toBeCalledTimes(0);
      expect(batchPutMock).toBeCalledTimes(0);
      expect(token).toMatchObject(fullTokenMockMap[TOKENS.BADGER]);
    });
    it('takes token from sdk and saves it', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = setupBatchGet([]);
      const sdkLoadMock = jest
        .spyOn(TokensService.prototype, 'loadTokens')
        .mockImplementation(async () => ({ [TOKENS.BADGER]: fullTokenMockMap[TOKENS.BADGER] }));

      const token = await getFullToken(TEST_CHAIN, TOKENS.BADGER);

      expect(batchGetMock).toBeCalled();
      expect(batchPutMock).toBeCalled();
      expect(sdkLoadMock).toBeCalled();
      expect(token).toMatchObject(fullTokenMockMap[TOKENS.BADGER]);
    });
    it('returns empty object', async () => {
      const batchPutMock = mockBatchPut([]);
      const batchGetMock = setupBatchGet([]);
      const sdkLoadMock = jest.spyOn(TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));

      const tokens = await getFullTokens(TEST_CHAIN, [
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
      const batchGetMock = setupBatchGet([fullTokenMockMap[TOKENS.BADGER], fullTokenMockMap[TOKENS.WBTC]]);
      const sdkLoadMock = jest
        .spyOn(TokensService.prototype, 'loadTokens')
        .mockImplementation(async () => ({ [TOKENS.WETH]: fullTokenMockMap[TOKENS.WETH] }));

      const expectedTokensMap = {
        [TOKENS.BADGER]: fullTokenMockMap[TOKENS.BADGER],
        [TOKENS.WBTC]: fullTokenMockMap[TOKENS.WBTC],
        [TOKENS.WETH]: fullTokenMockMap[TOKENS.WETH],
      };

      const tokens = await getFullTokens(TEST_CHAIN, [TOKENS.BADGER, TOKENS.WBTC, TOKENS.WETH]);

      expect(batchGetMock).toBeCalled();
      expect(batchPutMock).toBeCalled();
      expect(sdkLoadMock).toBeCalled();

      expect(tokens).toMatchObject(expectedTokensMap);
    });
  });
});
