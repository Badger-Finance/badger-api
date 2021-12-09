import { BadgerType } from '@badger-dao/sdk';
import { Ethereum } from '../chains/config/eth.config';
import { getLeaderboardKey } from '../indexers/leaderboard-indexer';
import { randomValue, setupMapper } from '../test/tests.utils';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';
import { getLeaderBoardSize, getUserLeaderBoardRank, queryLeaderboardSummary } from './leaderboards.utils';

describe('leaderboards.utils', () => {
  const chain = new Ethereum();
  const address = '0x05767d9ef41dc40689678ffca0608878fb3de906';

  const randomLeaderboard = (length: number, start?: number): CachedBoost[] => {
    if (length <= 0) {
      return [];
    }
    const minRank = start || 1;
    const maxBoost = 3;
    const maxRatio = 50;
    const maxMultiplier = 3;
    const entries: CachedBoost[] = [];
    for (let i = 0; i < length; i++) {
      entries.push(
        Object.assign(new CachedBoost(), {
          leaderboard: LeaderBoardType.BadgerBoost,
          rank: i + minRank,
          boost: maxBoost - i * 0.01,
          stakeRatio: maxRatio - i * 0.25,
          nftMultiplier: maxMultiplier - i * 0.01,
          address,
        }),
      );
    }
    return entries;
  };

  describe('queryLeaderboardSummary', () => {
    describe('no saved leaderboard summary data', () => {
      it('returns a map of all badger ranks with zero entries', async () => {
        setupMapper([]);
        const result = await queryLeaderboardSummary(chain);
        // result date will always update due to nature of function
        result.updatedAt = 133742069;
        expect(result).toMatchSnapshot();
      });
    });

    describe('saved leaderboard summary data', () => {
      it('returns the appropriate chain summary data', async () => {
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
        const result = await queryLeaderboardSummary(chain);
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('getLeaderBoardSize', () => {
    describe('with no saved leaderboard entries', () => {
      it('returns size 0', async () => {
        setupMapper(randomLeaderboard(0));
        const size = await getLeaderBoardSize(chain);
        expect(size).toEqual(0);
      });
    });

    describe('with saved entries', () => {
      it('returns the leaderboard size', async () => {
        const entries = randomLeaderboard(randomValue(2, 5));
        setupMapper(entries.reverse());
        const size = await getLeaderBoardSize(chain);
        expect(size).toEqual(entries.length);
      });
    });
  });

  describe('getUserLeaderBoardRank', () => {
    describe('with no saved leaderboard entries', () => {
      it('returns rank 0', async () => {
        setupMapper(randomLeaderboard(0));
        const rank = await getUserLeaderBoardRank(chain, address);
        expect(rank).toEqual(1);
      });
    });

    describe('with an unranked user', () => {
      it('returns past the maximum rank', async () => {
        const entries = randomLeaderboard(randomValue(2, 5));
        setupMapper(entries.reverse());
        const rank = await getUserLeaderBoardRank(chain, address);
        expect(rank).toEqual(entries.length);
      });
    });

    describe('with a ranked user', () => {
      it('returns the user rank', async () => {
        const randomRank = randomValue();
        const entries = randomLeaderboard(1, randomRank);
        setupMapper(entries);
        const rank = await getUserLeaderBoardRank(chain, entries[0].address);
        expect(rank).toEqual(randomRank);
      });
    });
  });
});
