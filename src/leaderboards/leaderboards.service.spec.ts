import { PlatformTest } from '@tsed/common';
import * as s3Utils from '../aws/s3.utils';
import { TOKENS } from '../config/tokens.config';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { CachedSettBoost } from '../setts/interfaces/cached-sett-boost.interface';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import { LeaderBoardsService } from './leaderboards.service';
import * as leaderboardUtils from './leaderboards.utils';

describe('leaderboards.service', () => {
  let service: LeaderBoardsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<LeaderBoardsService>(LeaderBoardsService);
  });

  afterEach(PlatformTest.reset);

  function randomCachedBoosts(count: number): CachedBoost[] {
    const boosts = [];
    for (let i = 0; i < count; i += 1) {
      boosts.push(
        Object.assign(new CachedBoost(), {
          leaderboard: LeaderBoardType.BadgerBoost,
          rank: i + 1,
          address: TEST_ADDR,
          boost: 2000 - i * 10,
          nftMultiplier: 1,
          stakeRatio: 1 - i * 0.01,
          nativeBalance: 100000 / (i + 1),
          nonNativeBalance: 250000 / (i + 1),
        }),
      );
    }
    return boosts;
  }

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
        const result = await service.loadFullLeaderBoard();
        expect(result).toMatchObject([]);
      });
    });
    describe('saved leaderboard entries', () => {
      it('returns all saved leaderboard entries', async () => {
        const expected = randomCachedBoosts(50);
        setupMapper(expected);
        const result = await service.loadFullLeaderBoard();
        expect(result).toMatchObject(expected);
      });
    });
  });

  describe('loadLeaderboardEntries', () => {
    describe('no saved leaderboard entries', () => {
      it('returns an empty array', async () => {
        setupMapper([]);
        const result = await service.loadLeaderboardEntries();
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
          const result = await service.loadLeaderboardEntries();
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
          const result = await service.loadLeaderboardEntries(page);
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
          const result = await service.loadLeaderboardEntries(page, size);
          expect(result).toMatchObject(expectedData(returned, saved.length, page, size));
        });
      });
    });
  });

  describe('generateBoostsLeaderBoard', () => {
    const seeded = randomCachedBoosts(50);
    const addresses = Object.values(TOKENS);
    const boostData: BoostData = {
      userData: Object.fromEntries(
        seeded.map((cachedBoost, i) => {
          cachedBoost.address = addresses[i];
          const boost = {
            ...cachedBoost,
            multipliers: {},
          };
          return [cachedBoost.address, boost];
        }),
      ),
      multiplierData: {},
    };

    let response: CachedBoost[];
    it('indexes all user accounts', async () => {
      jest
        .spyOn(s3Utils, 'getObject')
        .mockImplementation(() => Promise.resolve(Buffer.from(JSON.stringify(boostData), 'utf-8')));
      response = await LeaderBoardsService.generateBoostsLeaderBoard();
      expect(response).toMatchObject(seeded);
    });

    it('sorts ranks by boosts', () => {
      let last: number | undefined;
      for (const boost of response) {
        if (last) {
          expect(last).toBeLessThan(boost.rank);
        }
        last = boost.rank;
      }
    });

    // seeded data has 2 of each boost rank
    it('resovles boost rank ties with stake ratio score', () => {
      let last: number | undefined;
      for (const boost of response) {
        if (last) {
          expect(last).toBeGreaterThanOrEqual(boost.stakeRatio);
        }
        last = boost.stakeRatio;
      }
    });
  });

  describe('generateSettBoostData', () => {
    const seeded = randomCachedBoosts(5);
    const addresses = Object.values(TOKENS);
    const boostData: BoostData = {
      userData: Object.fromEntries(
        seeded.map((cachedBoost, i) => {
          cachedBoost.address = addresses[i];
          const boost = {
            ...cachedBoost,
            multipliers: {
              [TOKENS.BCVX]: cachedBoost.nativeBalance,
            },
          };
          return [cachedBoost.address, boost];
        }),
      ),
      multiplierData: {},
    };

    let response: CachedSettBoost[];
    it('indexes all user accounts', async () => {
      jest
        .spyOn(s3Utils, 'getObject')
        .mockImplementation(() => Promise.resolve(Buffer.from(JSON.stringify(boostData), 'utf-8')));
      response = await LeaderBoardsService.generateSettBoostData();
      const cachedBoosts = seeded
        .map((entry) => ({ address: TOKENS.BCVX, boost: entry.boost.toString(), multiplier: entry.nativeBalance }))
        .reverse();
      expect(response).toMatchObject(cachedBoosts);
    });
  });
});
