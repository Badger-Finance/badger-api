import { TOKENS } from '../config/tokens.config';
import { CachedBoost } from '../aws/models/cached-boost.model';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { randomCachedBoosts } from '../test/tests.utils';
import { generateBoostsLeaderBoard } from './leaderboard-indexer';
import * as accountsUtils from '../accounts/accounts.utils';
import { Ethereum } from '../chains/config/eth.config';
import { DataMapper } from '@aws/dynamodb-data-mapper';

describe('leaderboard-indexer', () => {
  const chain = new Ethereum();

  describe('generateBoostsLeaderBoard', () => {
    const seeded = randomCachedBoosts(2);
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

    async function getPerChainBoosts() {
      jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
      jest.spyOn(accountsUtils, 'getBoostFile').mockImplementation(() => Promise.resolve(boostData));
      const response = await generateBoostsLeaderBoard([chain]);
      const perChainBoosts: Record<string, CachedBoost[]> = {};
      response.forEach((res) => {
        if (!perChainBoosts[res.leaderboard]) {
          perChainBoosts[res.leaderboard] = [];
        }
        perChainBoosts[res.leaderboard] = perChainBoosts[res.leaderboard].concat(res);
      });
      return perChainBoosts;
    }

    it('indexes all user accounts', async () => {
      const perChainBoosts = await getPerChainBoosts();
      expect(perChainBoosts[seeded[0].leaderboard]).toMatchObject(seeded);
    });

    it('sorts ranks by boosts', async () => {
      const perChainBoosts = await getPerChainBoosts();
      for (const boosts of Object.values(perChainBoosts)) {
        let last: number | undefined;
        for (const boost of boosts) {
          if (last) {
            expect(last).toBeLessThan(boost.rank);
          }
          last = boost.rank;
        }
      }
    });

    // seeded data has 2 of each boost rank
    it('resovles boost rank ties with stake ratio score', async () => {
      const perChainBoosts = await getPerChainBoosts();
      for (const boosts of Object.values(perChainBoosts)) {
        let last: number | undefined;
        for (const boost of boosts) {
          if (last) {
            expect(last).toBeGreaterThanOrEqual(boost.stakeRatio);
          }
          last = boost.stakeRatio;
        }
      }
    });
  });
});
