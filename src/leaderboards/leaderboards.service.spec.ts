import { LeaderBoardData } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { randomCachedBoosts, setupMapper } from '../test/tests.utils';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderBoardsService } from './leaderboards.service';
import * as leaderboardUtils from './leaderboards.utils';

describe('leaderboards.service', () => {
  const chain = new Ethereum();
  let service: LeaderBoardsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<LeaderBoardsService>(LeaderBoardsService);
  });

  afterEach(PlatformTest.reset);

  function expectedData(expected: CachedBoost[], total: number, page?: number, size?: number): LeaderBoardData {
    const pageNumber = page || 0;
    const pageSize = size || 20;
    const maxPage = parseInt((total / pageSize).toString());
    return {
      data: expected,
      page: pageNumber,
      size: pageSize,
      count: expected.length,
      maxPage,
    };
  }

  describe('loadFullLeaderBoard', () => {
    describe('no saved leaderboard entries', () => {
      it('returns an empty array', async () => {
        setupMapper([]);
        const result = await service.loadFullLeaderBoard(chain);
        expect(result).toMatchObject([]);
      });
    });
    describe('saved leaderboard entries', () => {
      it('returns all saved leaderboard entries', async () => {
        const expected = randomCachedBoosts(50);
        setupMapper(expected);
        const result = await service.loadFullLeaderBoard(chain);
        expect(result).toMatchObject(expected);
      });
    });
  });

  describe('loadLeaderboardEntries', () => {
    describe('no saved leaderboard entries', () => {
      it('returns an empty array', async () => {
        setupMapper([]);
        const result = await service.loadLeaderboardEntries(chain);
        expect(result).toMatchObject(expectedData([], 0));
      });
    });
    describe('saved 50 leaderboard entries', () => {
      const saved = randomCachedBoosts(50);
      describe('no parameters', () => {
        it('returns an array of first 20 boosts', async () => {
          const returned = saved.slice(0, 20);
          setupMapper(returned);
          jest.spyOn(leaderboardUtils, 'getLeaderBoardSize').mockImplementation(() => Promise.resolve(saved.length));
          const result = await service.loadLeaderboardEntries(chain);
          expect(result).toMatchObject(expectedData(returned, saved.length));
        });
      });
      describe('requested page parameter', () => {
        it.each([
          [0, 0, 20],
          [1, 21, 40],
          [2, 41, 50],
        ])('page %d returns ranks %d through %d', async (page: number, start: number, end: number) => {
          const returned = saved.slice(start === 0 ? start : start - 1, end);
          setupMapper(returned);
          jest.spyOn(leaderboardUtils, 'getLeaderBoardSize').mockImplementation(() => Promise.resolve(saved.length));
          const result = await service.loadLeaderboardEntries(chain, page);
          expect(result).toMatchObject(expectedData(returned, saved.length, page));
        });
      });
      describe('requested page and size parameter', () => {
        it.each([
          [0, 10, 0, 10],
          [2, 10, 21, 30],
          [4, 5, 21, 25],
          [6, 7, 43, 49],
          [7, 7, 50, 50],
        ])('page %d returns ranks %d through %d', async (page: number, size: number, start: number, end: number) => {
          const returned = saved.slice(start === 0 ? start : start - 1, end);
          setupMapper(returned);
          jest.spyOn(leaderboardUtils, 'getLeaderBoardSize').mockImplementation(() => Promise.resolve(saved.length));
          const result = await service.loadLeaderboardEntries(chain, page, size);
          expect(result).toMatchObject(expectedData(returned, saved.length, page, size));
        });
      });
    });
  });
});
