import { TOKENS } from './tokens.config';
import { checksumEntries, successfulCapture } from './util';

describe('utils', () => {
  describe('successfulCapture', () => {
    describe('given an undefined result', () => {
      it('returns false', () => expect(successfulCapture(undefined)).toBeFalsy());
    });
    describe('given an null result', () => {
      it('returns false', () => expect(successfulCapture(null)).toBeFalsy());
    });
    describe('given an string result', () => {
      it('returns true', () => expect(successfulCapture('result')).toBeTruthy());
    });
    describe('given an number result', () => {
      it('returns true', () => expect(successfulCapture(23)).toBeTruthy());
    });
    describe('given an empty object result', () => {
      it('returns true', () => expect(successfulCapture({})).toBeTruthy());
    });
    describe('given an object result', () => {
      it('returns true', () => expect(successfulCapture({ propert: 'someValue' })).toBeTruthy());
    });
  });

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
