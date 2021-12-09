import { BadgerType } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { getLeaderboardKey } from '../indexers/leaderboard-indexer';
import { setupMapper } from '../test/tests.utils';
import { LeaderBoardsService } from './leaderboards.service';

describe('leaderboards.service', () => {
  const chain = new Ethereum();
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
          leaderboard: getLeaderboardKey(chain),
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
      const result = await service.fetchLeaderboardSummary(chain);
      expect(result).toMatchSnapshot();
    });
  });
});
