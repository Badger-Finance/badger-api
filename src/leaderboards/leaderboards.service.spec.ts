import { BadgerType } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import { getLeaderboardKey } from '../aws/dynamodb.utils';
import { setupMapper, TEST_CHAIN } from '../test/tests.utils';
import { LeaderBoardsService } from './leaderboards.service';

describe('leaderboards.service', () => {
  let service: LeaderBoardsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<LeaderBoardsService>(LeaderBoardsService);
  });

  afterEach(PlatformTest.reset);

  describe('fetchLeaderboardSummary', () => {
    it('returns the current leaderboard summary for the requested chain', async () => {
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
      const result = await service.fetchLeaderboardSummary(TEST_CHAIN);
      expect(result).toMatchSnapshot();
    });
  });
});
