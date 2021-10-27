import { TOKENS } from './tokens.config';
import { checksumEntries } from './util';

describe('utils', () => {
  describe('checksumEntries', () => {
    describe('given a valid address record with all lowercase addresses', () => {
      it('returns the address record with checksummed addresses', () => {
        const input = Object.fromEntries(Object.entries(TOKENS).map((e) => [e[0], e[1].toLowerCase()]));
        const actual = checksumEntries(input);
        expect(actual).toEqual(TOKENS);
      });
    });

    describe('given an invalid input', () => {
      it('throws an error', () => {
        expect(() => checksumEntries({ property: 'invalid ' })).toThrow();
      });
    });
  });
});
