import { NotFound } from '@tsed/exceptions';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import * as swapUtils from '../protocols/common/swap.utils';
import { getSettDefinition } from '../setts/setts.utils';
import { ethTokensConfig } from './config/eth-tokens.config';
import { formatBalance, getSettUnderlyingTokens, getToken, getTokenByName } from './tokens.utils';

describe('token.utils', () => {
  const rook = '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a';

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
        const definition = getSettDefinition(chain, TOKENS.BSUSHI_ETH_WBTC);
        // simulate an error looking up token liquidity
        jest.spyOn(swapUtils, 'getLiquidityData').mockImplementation((_chain, _contract) => {
          throw new Error();
        });
        await expect(getSettUnderlyingTokens(chain, definition)).rejects.toThrow(NotFound);
      });
    });
    describe('lookup single asset sett', () => {
      it('returns 1 underlying token', async () => {
        const definition = getSettDefinition(chain, TOKENS.BBADGER);
        const tokens = await getSettUnderlyingTokens(chain, definition);
        expect(tokens.length).toEqual(1);
        expect(tokens[0]).toMatchObject(ethTokensConfig[TOKENS.BADGER]);
      });
    });
    describe('lookup mutli asset sett', () => {
      it('returns multiple underlying tokens', async () => {
        const definition = getSettDefinition(chain, TOKENS.BSUSHI_ETH_WBTC);
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
});
