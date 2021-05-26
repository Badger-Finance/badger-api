import { BadRequest } from '@tsed/exceptions';
import { randomValue, setupMapper } from '../test/tests.utils';
import { CachedBoost } from './interface/cached-boost.interface';
import { getLeaderBoardEntryRange, getLeaderBoardSize, getUserLeaderBoardRank } from './leaderboards.utils';

describe('leaderboards.utils', () => {
  const address = '0x05767d9ef41dc40689678ffca0608878fb3de906';

  const randomLeaderboard = (length: number, start?: number): CachedBoost[] => {
    if (length <= 0) {
      return [];
    }
    const minRank = start || 1;
    const maxBoost = 3;
    const maxRatio = 50;
    const entries: CachedBoost[] = [];
    for (let i = 0; i < length; i++) {
      entries.push(
        Object.assign(CachedBoost, {
          leaderboard: '',
          rank: i + minRank,
          boost: maxBoost - i * 0.01,
          stakeRatio: maxRatio - i * 0.25,
          address,
        }),
      );
    }
    return entries;
  };

  describe('getLeaderBoardEntryRange', () => {
    describe('with no saved leaderboard entries', () => {
      it('returns no entries', async () => {
        setupMapper(randomLeaderboard(0));
        const start = randomValue();
        const end = start + 20;
        const boosts = await getLeaderBoardEntryRange(start, end);
        expect(boosts).toMatchObject([]);
      });
    });

    describe('called with invalid range parameters', () => {
      it('throws a bad request expection', async () => {
        const start = randomValue();
        const end = start - 20;
        await expect(getLeaderBoardEntryRange(start, end)).rejects.toThrow(BadRequest);
      });
    });

    describe('with saved entries', () => {
      describe('querying a range with entries', () => {
        it('returns queried range', async () => {
          const start = randomValue();
          const end = start + 20;
          const seed = randomLeaderboard(end - start, start);
          setupMapper(seed);
          const boosts = await getLeaderBoardEntryRange(start, end);
          expect(boosts).toMatchObject(seed);
        });
      });

      describe('querying a range with partial entries', () => {
        it('returns queried range for available entries', async () => {
          const start = randomValue();
          const end = start + 20;
          const seedEntries = (end - start) / 2;
          const seed = randomLeaderboard(seedEntries, start);
          setupMapper(seed);
          const boosts = await getLeaderBoardEntryRange(start, end);
          expect(boosts).toMatchObject(seed);
        });
      });
    });
  });

  describe('getLeaderBoardSize', () => {
    describe('with no saved leaderboard entries', () => {
      it('returns size 0', async () => {
        setupMapper(randomLeaderboard(0));
        const size = await getLeaderBoardSize();
        expect(size).toEqual(0);
      });
    });

    describe('with saved entries', () => {
      it('returns size 0', async () => {
        const entries = randomLeaderboard(randomValue());
        setupMapper(entries);
        const size = await getLeaderBoardSize();
        expect(size).toEqual(entries.length);
      });
    });
  });

  describe('getUserLeaderBoardRank', () => {
    describe('with no saved leaderboard entries', () => {
      it('returns rank 0', async () => {
        setupMapper(randomLeaderboard(0));
        const rank = await getUserLeaderBoardRank(address);
        expect(rank).toEqual(1);
      });
    });

    describe('with an unranked user', () => {
      it('returns past the maximum rank', async () => {
        const entries = randomLeaderboard(randomValue());
        setupMapper(entries);
        const rank = await getUserLeaderBoardRank(address);
        expect(rank).toEqual(entries.length);
      });
    });

    describe('with a ranked user', () => {
      it('returns the user rank', async () => {
        const randomRank = randomValue();
        const entries = randomLeaderboard(1, randomRank);
        setupMapper(entries);
        const rank = await getUserLeaderBoardRank(entries[0].address);
        expect(rank).toEqual(randomRank);
      });
    });
  });
});
