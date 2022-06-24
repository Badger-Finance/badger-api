import { BadgerType } from '@badger-dao/sdk';

import { getLeaderboardKey } from '../aws/dynamodb.utils';
import { setupMapper, TEST_CHAIN } from '../test/tests.utils';
import { queryLeaderboardSummary } from './leaderboards.utils';

describe('leaderboards.utils', () => {
  describe('queryLeaderboardSummary', () => {
    describe('no saved leaderboard summary data', () => {
      it('returns a map of all badger ranks with zero entries', async () => {
        setupMapper([]);
        const result = await queryLeaderboardSummary(TEST_CHAIN);
        // result date will always update due to nature of function
        result.updatedAt = 133742069;
        expect(result).toMatchSnapshot();
      });
    });

    describe('saved leaderboard summary data', () => {
      it('returns the appropriate TEST_CHAIN summary data', async () => {
        setupMapper([
          {
            leaderboard: getLeaderboardKey(TEST_CHAIN),
            rankSummaries: [
              {
                badgerType: BadgerType.Basic,
                amount: 1000,
              },
              {
                badgerType: BadgerType.Neo,
                amount: 20,
              },
              {
                badgerType: BadgerType.Hero,
                amount: 35,
              },
              {
                badgerType: BadgerType.Hyper,
                amount: 25,
              },
              {
                badgerType: BadgerType.Frenzy,
                amount: 40,
              },
            ],
            updatedAt: 133742069,
          },
        ]);
        const result = await queryLeaderboardSummary(TEST_CHAIN);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
