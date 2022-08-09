import { ONE_DAY_MS } from '@badger-dao/sdk';

import { TOKENS } from '../config/tokens.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { MOCK_VAULT_DEFINITION } from '../test/constants';
import { setupMapper } from '../test/tests.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { mockBalance } from '../tokens/tokens.utils';
import { VAULT_SOURCE } from './vaults.utils';
import { calculateBalanceDifference, calculateYield, createYieldSource, getYieldSources } from './yields.utils';

describe('yields.utils', () => {
  describe('calculateYield', () => {
    it.each([
      [365, 1, ONE_DAY_MS, 0, 100],
      [365, 0.5, ONE_DAY_MS, 0, 50],
      [365, 2, ONE_DAY_MS, 0, 200],
      [365, 1, ONE_DAY_MS, 365, 171.45674820219733],
      [365, 1, ONE_DAY_MS, 180, 114.37716231252146],
    ])(
      '%d earned %d over %d ms with %d compounded, for %d apr',
      (principal, earned, duration, compoundingValue, expected) => {
        expect(calculateYield(principal, earned, duration, compoundingValue)).toEqual(expected);
      },
    );
  });

  describe('calculateBalanceDifference', () => {
    it('returns an array with the difference in token amounts', () => {
      const badger = fullTokenMockMap[TOKENS.BADGER];
      const wbtc = fullTokenMockMap[TOKENS.WBTC];
      const listA = [mockBalance(badger, 10), mockBalance(wbtc, 2)];
      const listB = [mockBalance(badger, 25), mockBalance(wbtc, 5)];
      expect(calculateBalanceDifference(listA, listB)).toMatchObject([mockBalance(badger, 15), mockBalance(wbtc, 3)]);
    });
  });

  describe('getYieldSources', () => {
    it('returns vault yield sources categorized by required breakdown', async () => {
      const mockSources = [
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.PreCompound, VAULT_SOURCE, 7),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Compound, VAULT_SOURCE, 11),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.TradeFee, 'LP Fees', 2),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Emission, 'Badger', 4),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Emission, 'Boosted Badger', 6, { min: 0.5, max: 2 }),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Flywheel, 'Vault Flywheel', 5),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Distribution, 'Badger', 3),
      ];
      setupMapper(mockSources);
      const yieldSources = await getYieldSources(MOCK_VAULT_DEFINITION);
      expect(yieldSources).toMatchSnapshot();
    });
  });
});
