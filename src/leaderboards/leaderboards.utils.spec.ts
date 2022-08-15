import { BadgerType } from '@badger-dao/sdk';

import { getLeaderboardKey } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { queryLeaderboardSummary } from './leaderboards.utils';

describe('leaderboards.utils', () => {
  describe('queryLeaderboardSummary', () => {
    let chain: Chain;

    beforeEach(() => {
      chain = setupMockChain();
    });

    describe('no saved leaderboard summary data', () => {
      it('returns a map of all badger ranks with zero entries', async () => {
        mockQuery([]);
        const result = await queryLeaderboardSummary(chain);
        // result date will always update due to nature of function
        result.updatedAt = 133742069;
        expect(result).toMatchSnapshot();
      });
    });

    describe('saved leaderboard summary data', () => {
      it('returns the appropriate TEST_CHAIN summary data', async () => {
        mockQuery([
          {
            leaderboard: getLeaderboardKey(chain.network),
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
        const result = await queryLeaderboardSummary(chain);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
