import { BadgerType } from '@badger-dao/sdk';

import { getBadgerType } from './leaderboards.config';

describe('leaderboards.config', () => {
  describe('getBadgerType', () => {
    it.each([
      [BadgerType.Basic, 1, 19],
      [BadgerType.Neo, 20, 199],
      [BadgerType.Hero, 200, 599],
      [BadgerType.Hyper, 600, 1399],
      [BadgerType.Frenzy, 1400, 2000]
    ])('returns %s badger for scores %d to %d', (badgerType: BadgerType, start: number, end: number) => {
      for (let i = start; i < end; i++) {
        expect(getBadgerType(i)).toEqual(badgerType);
      }
    });
  });
});
