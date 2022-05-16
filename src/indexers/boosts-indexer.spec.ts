import { TOKENS } from '../config/tokens.config';
import { BoostMultiplierData } from '../rewards/interfaces/boost-multiplier-data.interface';
import { UserBoosts } from '../rewards/interfaces/user-boosts.interface';
import { TEST_ADDR, TEST_CHAIN } from '../test/tests.utils';
import * as boostIndexer from './boosts-indexer';

describe('boosts-indexer', () => {
  // common test data
  let multiplierData: BoostMultiplierData;
  let userData: UserBoosts;

  beforeEach(() => {
    multiplierData = {
      [TEST_ADDR]: {
        min: 1,
        max: 10,
      },
    };
    userData = {
      [TEST_ADDR]: {
        address: TEST_ADDR,
        rank: 30,
        boost: 1000,
        nativeBalance: 10,
        nonNativeBalance: 20,
        stakeRatio: 0.5,
        nftBalance: 10,
        bveCvxBalance: 5,
        diggBalance: 1,
        multipliers: {
          [TEST_ADDR]: 5.5,
        },
      },
    };
  });

  describe('evaluateUserBoosts', () => {
    it('returns an empty record on an empty boost file', () => {
      const result = boostIndexer.evaluateUserBoosts(TEST_CHAIN, {
        multiplierData: {},
        userData: {},
      });
      expect(result).toMatchObject({});
    });

    it('uses existing user boost if applicable', () => {
      const result = boostIndexer.evaluateUserBoosts(TEST_CHAIN, {
        multiplierData,
        userData,
      });
      expect(result).toMatchSnapshot();
    });

    it('updates user boost if applicable', () => {
      userData[TEST_ADDR].boost = 2000;
      const result = boostIndexer.evaluateUserBoosts(TEST_CHAIN, {
        multiplierData,
        userData,
      });
      expect(result).toMatchSnapshot();
    });

    it('adds user boost if applicable', () => {
      multiplierData[TOKENS.BBADGER] = { min: 2, max: 22 };
      const result = boostIndexer.evaluateUserBoosts(TEST_CHAIN, {
        multiplierData,
        userData,
      });
      expect(result).toMatchSnapshot();
    });
  });
});
