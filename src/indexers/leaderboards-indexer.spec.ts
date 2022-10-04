import { DataMapper, StringToAnyObjectMap, SyncOrAsyncIterable } from '@aws/dynamodb-data-mapper';

import { CachedBoost } from '../aws/models/cached-boost.model';
import * as s3Utils from '../aws/s3.utils';
import { TOKENS } from '../config/tokens.config';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { mockBatchDelete, mockBatchPut, mockQuery, randomCachedBoosts, setupMockChain } from '../test/mocks.utils';
import { indexBoostLeaderBoard } from './leaderboards-indexer';

describe('leaderboard-indexer', () => {
  const seeded = randomCachedBoosts(4);
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

  let batchPut: jest.SpyInstance<
    AsyncIterableIterator<StringToAnyObjectMap>,
    [items: SyncOrAsyncIterable<StringToAnyObjectMap>]
  >;

  beforeEach(async () => {
    setupMockChain();
    mockQuery([seeded]);
    batchPut = mockBatchPut([]);
    mockBatchDelete([]);
    jest.spyOn(Date, 'now').mockImplementation(() => 1000);
    jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
  });

  describe('generateBoostsLeaderBoard', () => {
    it('sorts ranks by boosts, and resovles boost rank ties with stake ratio score', async () => {
      jest.spyOn(s3Utils, 'getBoostFile').mockImplementation(async () => boostData);
      await indexBoostLeaderBoard();
      expect(batchPut.mock.calls[0][0]).toMatchObject(seeded);
      let lastRank: number | undefined;
      let lastStakeRatio: number | undefined;
      for (const boost of batchPut.mock.calls[0][0] as CachedBoost[]) {
        if (lastRank) {
          expect(lastRank).toBeLessThan(boost.boostRank);
        }
        lastRank = boost.boostRank;
        if (lastStakeRatio) {
          expect(lastStakeRatio).toBeGreaterThanOrEqual(boost.stakeRatio);
        }
        lastStakeRatio = boost.stakeRatio;
      }
    });

    it('returns no data given a missing boost file', async () => {
      jest.spyOn(s3Utils, 'getBoostFile').mockImplementation(async () => null);
      await indexBoostLeaderBoard();
      expect(batchPut.mock.calls.length).toEqual(0);
    });

    it('returns no data given a error loading boost file', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(s3Utils, 'getBoostFile').mockImplementation(async () => {
        throw new Error('Expected test error: getBoostFile');
      });
      await indexBoostLeaderBoard();
      expect(batchPut.mock.calls.length).toEqual(0);
    });
  });
});
