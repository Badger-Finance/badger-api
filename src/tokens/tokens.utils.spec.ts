import { Protocol } from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { tokenBalancesToCachedLiquidityPoolTokenBalance } from '../indexers/indexer.utils';
import * as priceUtils from '../prices/prices.utils';
import * as swapUtils from '../protocols/common/swap.utils';
import * as vaultUtils from '../vaults/vaults.utils';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { setupMapper } from '../test/tests.utils';
import { ethTokensConfig } from './config/eth-tokens.config';
import { CachedTokenBalance } from './interfaces/cached-token-balance.interface';
import { TokenBalance } from './interfaces/token-balance.interface';
import { TokenPriceSnapshot } from './interfaces/token-price-snapshot.interface';
import {
  cachedTokenBalanceToTokenBalance,
  formatBalance,
  getCachedTokenBalances,
  getSettUnderlyingTokens,
  getToken,
  getTokenByName,
  getVaultTokens,
  mockBalance,
  toBalance,
  toCachedBalance,
} from './tokens.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';

describe('token.utils', () => {
  const rook = '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a';

  beforeEach(() => {
    jest.spyOn(vaultUtils, 'getCachedSett').mockImplementation(async (vault: VaultDefinition) => {
      const defaultVault = vaultUtils.defaultVault(vault);
      defaultVault.balance = 10;
      return defaultVault;
    });
    jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (contract): Promise<TokenPriceSnapshot> => {
      const token = getToken(contract);
      const price = parseInt(token.address.slice(0, 4), 16);
      return {
        name: token.name,
        address: token.address,
        usd: price,
        eth: price,
        updatedAt: Date.now(),
      };
    });
  });

  describe('getToken', () => {
    describe('lookup invalid token address', () => {
      it('throws a not found error', () => {
        expect(() => getToken(rook)).toThrow(NotFound);
        expect(() => getToken(rook)).toThrow(`${rook} not supported`);
      });
    });
    describe('lookup supported token address', () => {
      it('returns the requested token information', () => {
        const expected = ethTokensConfig[TOKENS.BADGER];
        const actual = getToken(expected.address);
        expect(actual).toMatchObject(expected);
      });
    });
  });

  describe('getTokenByName', () => {
    describe('lookup invalid token name', () => {
      it('throws a not found error', () => {
        const token = 'invalid-token';
        expect(() => getTokenByName(token)).toThrow(NotFound);
        expect(() => getTokenByName(token)).toThrow(`${token} not supported`);
      });
    });
    describe('lookup supported token name', () => {
      it('returns the requested token information', () => {
        const expected = getToken(TOKENS.BADGER);
        const actual = getTokenByName(expected.name);
        expect(actual).toMatchObject(expected);
      });
    });
  });

  describe('getSettUnderlyingTokens', () => {
    const chain = new Ethereum();

    describe('lookup invalid lp token sett definition', () => {
      it('throws a not found error', async () => {
        const definition = getVaultDefinition(chain, TOKENS.BSUSHI_ETH_WBTC);
        // simulate an error looking up token liquidity
        jest.spyOn(swapUtils, 'getLiquidityData').mockImplementation((_chain, _contract) => {
          throw new Error();
        });
        await expect(getSettUnderlyingTokens(chain, definition)).rejects.toThrow(NotFound);
      });
    });
    describe('lookup single asset sett', () => {
      it('returns 1 underlying token', async () => {
        const definition = getVaultDefinition(chain, TOKENS.BBADGER);
        const tokens = await getSettUnderlyingTokens(chain, definition);
        expect(tokens.length).toEqual(1);
        expect(tokens[0]).toMatchObject(ethTokensConfig[TOKENS.BADGER]);
      });
    });
    describe('lookup mutli asset sett', () => {
      it('returns multiple underlying tokens', async () => {
        const definition = getVaultDefinition(chain, TOKENS.BSUSHI_ETH_WBTC);
        // simulate looking up token liquidity
        jest.spyOn(swapUtils, 'getLiquidityData').mockImplementation(async (_chain, contract) => ({
          contract,
          token0: TOKENS.WETH,
          token1: TOKENS.WBTC,
          reserve0: 1,
          reserve1: 1,
          totalSupply: 1,
        }));
        const tokens = await getSettUnderlyingTokens(chain, definition);
        expect(tokens.length).toBeGreaterThan(1);
        const expected = [TOKENS.WBTC, TOKENS.WETH].sort();
        expect(tokens.map((t) => t.address).sort()).toMatchObject(expected);
      });
    });
  });

  describe('formatBalance', () => {
    describe('given valid input', () => {
      it.each([
        ['12345000000000000000', undefined, 12.345],
        ['12345000000000000000', 15, 12345],
        ['12345000000000000000', 12, 12345000],
        ['12345000000000000000', 21, 0.012345],
        ['12345000033000000000', 15, 12345.000033],
        ['00000000000000000000', undefined, 0],
        ['00000000000000000000', 15, 0],
        ['00000000000000000000', 21, 0],
      ])('Evaluates %s with %i decimals as %f', (input, decimals, result) => {
        expect(result).toEqual(formatBalance(input, decimals));
      });
    });
  });

  describe('cachedTokenBalanceToTokenBalance', () => {
    describe('no requested currency', () => {
      it('converts to a usd based token balance', () => {
        const valueEth = 1;
        const valueUsd = 2000;
        const badger = getToken(TOKENS.BADGER);
        const base = {
          name: badger.name,
          address: badger.address,
          symbol: badger.symbol,
          decimals: badger.decimals,
        };
        const expected: TokenBalance = {
          ...base,
          balance: 1,
          value: valueUsd,
        };
        const balance: CachedTokenBalance = {
          ...base,
          balance: 1,
          valueUsd,
          valueEth,
        };
        const actual = cachedTokenBalanceToTokenBalance(balance);
        expect(actual).toMatchObject(expected);
      });
    });

    describe('with a requested currency', () => {
      it.each(['eth', 'usd'])('converts to an %s based token balance', (currency) => {
        const valueEth = 1;
        const valueUsd = 2000;
        const badger = getToken(TOKENS.BADGER);
        const base = {
          name: badger.name,
          address: badger.address,
          symbol: badger.symbol,
          decimals: badger.decimals,
        };
        const expected: TokenBalance = {
          ...base,
          balance: 1,
          value: currency === 'eth' ? valueEth : valueUsd,
        };
        const balance: CachedTokenBalance = {
          ...base,
          balance: 1,
          valueUsd,
          valueEth,
        };
        const actual = cachedTokenBalanceToTokenBalance(balance, currency);
        expect(actual).toMatchObject(expected);
      });
    });
  });

  describe('toBalance', () => {
    describe('no requested currency', () => {
      it('converts to a usd based token balance', async () => {
        const badger = getToken(TOKENS.BADGER);
        const price = {
          name: badger.name,
          address: badger.name,
          usd: 8,
          eth: 8 / 1800,
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
      it.each(['eth', 'usd'])('converts to an %s based token balance', async (currency) => {
        const badger = getToken(TOKENS.BADGER);
        const price = {
          name: badger.name,
          address: badger.name,
          usd: 8,
          eth: 8 / 1800,
          updatedAt: Date.now(),
        };
        jest.spyOn(priceUtils, 'getPrice').mockImplementationOnce(async (_contract) => price);
        const actual = await toBalance(badger, 10, currency);
        const expected = {
          name: badger.name,
          address: badger.address,
          symbol: badger.symbol,
          decimals: badger.decimals,
          balance: 10,
          value: currency === 'eth' ? 80 / 1800 : 80,
        };
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('toCachedBalance', () => {
    it('converts token and balance to a cached balance', async () => {
      const badger = getToken(TOKENS.BADGER);
      const price = {
        name: badger.name,
        address: badger.name,
        usd: 8,
        eth: 8 / 1800,
        updatedAt: Date.now(),
      };
      jest.spyOn(priceUtils, 'getPrice').mockImplementationOnce(async (_contract) => price);
      const actual = await toCachedBalance(badger, 10);
      const expected = {
        name: badger.name,
        address: badger.address,
        symbol: badger.symbol,
        decimals: badger.decimals,
        balance: 10,
        valueUsd: 80,
        valueEth: 80 / 1800,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('mockBalance', () => {
    describe('no requested currency', () => {
      it('converts to a usd based token balance', () => {
        const badger = getToken(TOKENS.BADGER);
        const mockPrice = parseInt(badger.address.slice(0, 4), 16);
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
      it.each(['eth', 'usd'])('converts to an %s based token balance', (currency) => {
        const badger = getToken(TOKENS.BADGER);
        const mockPrice = parseInt(badger.address.slice(0, 4), 16);
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

  describe('toCachedBalance', () => {
    it('converts token and balance to a cached balance', async () => {
      const badger = getToken(TOKENS.BADGER);
      const price = {
        name: badger.name,
        address: badger.name,
        usd: 8,
        eth: 8 / 1800,
        updatedAt: Date.now(),
      };
      jest.spyOn(priceUtils, 'getPrice').mockImplementationOnce(async (_contract) => price);
      const actual = await toCachedBalance(badger, 10);
      const expected = {
        name: badger.name,
        address: badger.address,
        symbol: badger.symbol,
        decimals: badger.decimals,
        balance: 10,
        valueUsd: 80,
        valueEth: 80 / 1800,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('getCachedTokenBalances', () => {
    describe('no saved balances', () => {
      it('returns undefined', async () => {
        setupMapper([]);
        const result = await getCachedTokenBalances(TOKENS.SUSHI_WBTC_WETH, Protocol.Sushiswap);
        expect(result).toBeFalsy();
      });
    });

    describe('saved balances', () => {
      describe('no requested currency', () => {
        it('converts to a usd based token balance', async () => {
          const wbtc = getToken(TOKENS.WBTC);
          const weth = getToken(TOKENS.WETH);
          jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (contract): Promise<TokenPriceSnapshot> => {
            const token = getToken(contract);
            const price = parseInt(token.address.slice(0, 4), 16);
            return {
              name: token.name,
              address: token.address,
              usd: price,
              eth: price,
              updatedAt: Date.now(),
            };
          });
          const balances = await Promise.all([toCachedBalance(wbtc, 1), toCachedBalance(weth, 20)]);
          const cached = tokenBalancesToCachedLiquidityPoolTokenBalance(
            TOKENS.SUSHI_ETH_WBTC,
            Protocol.Sushiswap,
            balances,
          );
          setupMapper([cached]);
          const expected = await Promise.all([toBalance(wbtc, 1), toBalance(weth, 20)]);
          const actual = await getCachedTokenBalances(TOKENS.SUSHI_ETH_WBTC, Protocol.Sushiswap);
          expect(actual).toMatchObject(expected);
        });
      });

      describe('with a requested currency', () => {
        it.each(['eth', 'usd'])('converts to an %s based token balance', async (currency) => {
          const wbtc = getToken(TOKENS.WBTC);
          const weth = getToken(TOKENS.WETH);
          jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (contract): Promise<TokenPriceSnapshot> => {
            const token = getToken(contract);
            const price = parseInt(token.address.slice(0, 4), 16);
            return {
              name: token.name,
              address: token.address,
              usd: price,
              eth: price,
              updatedAt: Date.now(),
            };
          });
          const balances = await Promise.all([toCachedBalance(wbtc, 1), toCachedBalance(weth, 20)]);
          const cached = tokenBalancesToCachedLiquidityPoolTokenBalance(
            TOKENS.SUSHI_ETH_WBTC,
            Protocol.Sushiswap,
            balances,
          );
          setupMapper([cached]);
          const expected = await Promise.all([toBalance(wbtc, 1, currency), toBalance(weth, 20, currency)]);
          const actual = await getCachedTokenBalances(TOKENS.SUSHI_ETH_WBTC, Protocol.Sushiswap, currency);
          expect(actual).toMatchObject(expected);
        });
      });
    });
  });

  describe('getVaultTokens', () => {
    it('returns the single underlying token for a non liquidity token underlying token', async () => {
      const liquidity = getVaultDefinition(new Ethereum(), TOKENS.BBADGER);
      const tokens = await getVaultTokens(liquidity, 10);
      expect(tokens).toMatchSnapshot();
    });

    it('returns all deposit token for a liquidity token underlying token', async () => {
      const wbtc = getToken(TOKENS.WBTC);
      const weth = getToken(TOKENS.WETH);
      const balances = await Promise.all([toCachedBalance(wbtc, 1), toCachedBalance(weth, 20)]);
      const cached = tokenBalancesToCachedLiquidityPoolTokenBalance(
        TOKENS.SUSHI_ETH_WBTC,
        Protocol.Sushiswap,
        balances,
      );
      setupMapper([cached]);
      const liquidity = getVaultDefinition(new Ethereum(), TOKENS.BSUSHI_ETH_WBTC);
      const tokens = await getVaultTokens(liquidity, 10);
      expect(tokens).toMatchSnapshot();
    });
  });
});
