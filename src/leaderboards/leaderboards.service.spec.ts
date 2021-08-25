import { PlatformTest } from '@tsed/common';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { LeaderBoardType } from './enums/leaderboard-type.enum';
import { CachedBoost } from './interface/cached-boost.interface';
import { LeaderBoardData } from './interface/leaderboard-data.interrface';
import { LeaderBoardsService } from './leaderboards.service';

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
      boosts.push(Object.assign(new CachedBoost(), {
        leaderboard: LeaderBoardType.BadgerBoost,
        rank: i,
        address: TEST_ADDR,
        boost: 2000 - (i * 10),
        nftMultiplier: 1,
        stakeRatio: 1 - (i * 0.01),
        nativeBalance: 100000 / (i + 1),
        nonNativeBalance: 250000 / (i + 1),
      }));
    }
    return boosts;
  }

  function expectedData(expected: CachedBoost[], page?: number, size?: number): LeaderBoardData {
    const pageNumber = page || 0;
    const pageSize = size || 20;
    const offset = pageNumber > 0 ? 1 : 0;
    const start = pageNumber * pageSize + offset;
    const end = start + pageSize - offset;
    const maxPage = parseInt((expected.length / pageSize).toString());
    const data = expected.slice(start, end);
    return {
      data,
      page: pageNumber,
      size: pageSize,
      count: data.length,
      maxPage,
    }
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
        expect(result).toMatchObject(expectedData([]));
      });
    });
    describe('saved 50 leaderboard entries', () => {
      const saved = randomCachedBoosts(50);
      setupMapper(saved);
      describe('no parameters', () => {
        it('returns an array of first 20 boosts', async () => {
          const result = await service.loadLeaderboardEntries();
          expect(result).toMatchObject(saved.slice(20));
        });
      });
    });
  });
});
