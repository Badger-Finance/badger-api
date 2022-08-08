import { ONE_DAY_MS } from '@badger-dao/sdk';
import { calculateYield } from './yields.utils';

describe('yields.utils', () => {
  describe('calculateYield', () => {
    it.each([
      [365, 1, ONE_DAY_MS, 0, 100],
      [365, 0.5, ONE_DAY_MS, 0, 50],
      [365, 2, ONE_DAY_MS, 0, 200],
      [365, 1, ONE_DAY_MS, 365, 171.45674820219733],
      [365, 1, ONE_DAY_MS, 180, 114.37716231252146],
    ])(
      '%d earned %d over %d ms with %d compounded, for %d apr',
      (principal, earned, duration, compoundingValue, expected) => {
        expect(calculateYield(principal, earned, duration, compoundingValue)).toEqual(expected);
      },
    );
  });
});
