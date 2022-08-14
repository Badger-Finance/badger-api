import { DataMapper, StringToAnyObjectMap, SyncOrAsyncIterable } from "@aws/dynamodb-data-mapper";

import * as accountsUtils from "../accounts/accounts.utils";
import { CachedBoost } from "../aws/models/cached-boost.model";
import { TOKENS } from "../config/tokens.config";
import { BoostData } from "../rewards/interfaces/boost-data.interface";
import { mockBatchDelete, mockBatchPut, mockQuery } from "../test/mocks.utils";
import { randomCachedBoosts } from "../test/tests.utils";
import { indexBoostLeaderBoard } from "./leaderboard-indexer";

describe("leaderboard-indexer", () => {
  const seeded = randomCachedBoosts(2);
  const addresses = Object.values(TOKENS);
  const boostData: BoostData = {
    userData: Object.fromEntries(
      seeded.map((cachedBoost, i) => {
        cachedBoost.address = addresses[i];
        const boost = {
          ...cachedBoost,
          multipliers: {}
        };
        return [cachedBoost.address, boost];
      })
    ),
    multiplierData: {}
  };

  let batchPut: jest.SpyInstance<AsyncIterableIterator<StringToAnyObjectMap>, [items: SyncOrAsyncIterable<StringToAnyObjectMap>]>;

  beforeEach(async () => {
    mockQuery([]);
    batchPut = mockBatchPut([]);
    mockBatchDelete([]);
    jest.spyOn(Date, "now").mockImplementation(() => 1000);
    jest.spyOn(DataMapper.prototype, "put").mockImplementation();
    jest.spyOn(accountsUtils, "getBoostFile").mockImplementation(() => Promise.resolve(boostData));
    await indexBoostLeaderBoard();
  });

  afterAll(() => jest.resetAllMocks());

  describe("generateBoostsLeaderBoard", () => {
    it("indexes all user accounts", async () => {
      expect(batchPut.mock.calls[0][0]).toMatchObject(Object.values(seeded));
    });

    it("sorts ranks by boosts", async () => {
      let last: number | undefined;
      for (const boost of batchPut.mock.calls[0][0] as CachedBoost[]) {
        if (last) {
          expect(last).toBeLessThan(boost.boostRank);
        }
        last = boost.boostRank;
      }
    });

    // seeded data has 2 of each boost rank
    it("resovles boost rank ties with stake ratio score", async () => {
      let last: number | undefined;
      for (const boost of batchPut.mock.calls[0][0] as CachedBoost[]) {
        if (last) {
          expect(last).toBeGreaterThanOrEqual(boost.stakeRatio);
        }
        last = boost.stakeRatio;
      }
    });
  });
});
