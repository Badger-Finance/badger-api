import { ONE_DAY_MS, VaultState } from '@badger-dao/sdk';

import { TOKENS } from '../config/tokens.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION } from '../test/constants';
import { mockBalance, mockQuery } from '../test/mocks.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { VAULT_SOURCE } from './vaults.utils';
import {
  calculateBalanceDifference,
  calculateYield,
  createYieldSource,
  getVaultYieldProjection,
  getYieldSources,
} from './yields.utils';

describe('yields.utils', () => {
  const baseMockSources = [
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.PreCompound, VAULT_SOURCE, 7),
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Compound, VAULT_SOURCE, 11),
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.TradeFee, 'LP Fees', 2),
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Emission, 'Badger', 4),
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Emission, 'Boosted Badger', 6, { min: 0.5, max: 2 }),
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Flywheel, 'Vault Flywheel', 5),
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Distribution, 'Badger', 3),
    createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Distribution, 'Irrelevant', 0.0001),
  ];

  describe('calculateYield', () => {
    it.each([
      [365, 1, ONE_DAY_MS, 0, 100],
      [365, 0.5, ONE_DAY_MS, 0, 50],
      [365, 2, ONE_DAY_MS, 0, 200],
      [365, 1, ONE_DAY_MS, 1, 171.45674820219733],
      [365, 1, ONE_DAY_MS, 0.5, 114.81572517391494],
      [0, 1, ONE_DAY_MS, 0, 0],
    ])(
      '%d earned %d over %d ms with %d compounded, for %d apr',
      (principal, earned, duration, compoundingValue, expected) => {
        expect(calculateYield(principal, earned, duration, compoundingValue)).toEqual(expected);
      },
    );

    it('throws an error when provided with invalid principal and compounding pair', () => {
      expect(() => calculateYield(365, 1, ONE_DAY_MS, 2)).toThrow(
        'Compounding value must be less than or equal to earned',
      );
    });
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
      mockQuery(baseMockSources);
      const yieldSources = await getYieldSources(MOCK_VAULT_DEFINITION);
      expect(yieldSources).toMatchSnapshot();
    });

    it('returns only passive yield sources for a discontinued vault', async () => {
      const mockSources = [
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.PreCompound, VAULT_SOURCE, 7),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Compound, VAULT_SOURCE, 11),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.TradeFee, 'LP Fees', 2),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Flywheel, 'Vault Flywheel', 5),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Distribution, 'Badger', 3),
        createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Distribution, 'Irrelevant', 0.0001),
      ];
      mockQuery(mockSources);
      const definitionCopy = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      definitionCopy.state = VaultState.Discontinued;
      const yieldSources = await getYieldSources(definitionCopy);
      expect(yieldSources).toMatchSnapshot();
    });
  });

  describe('getVaultYieldProjection', () => {
    it('returns a yield projection estimation from given inputs', async () => {
      const mockDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      mockDefinition.address = MOCK_VAULT.vaultToken;
      mockQuery(baseMockSources);
      jest.spyOn(Date, 'now').mockImplementation(() => referenceTime);
      const yieldSources = await getYieldSources(mockDefinition);
      const referenceTime = 1660071985202;
      const wbtc = fullTokenMockMap[TOKENS.WBTC];
      const mockVault = JSON.parse(JSON.stringify(MOCK_VAULT));
      mockVault.lastHarvest = referenceTime - ONE_DAY_MS * 30;
      const mockYieldEstimate = {
        vault: MOCK_VAULT.vaultToken,
        yieldTokens: [mockBalance(wbtc, 0.0092)],
        harvestTokens: [mockBalance(wbtc, 0.0091)],
        previousYieldTokens: [mockBalance(wbtc, 0.0048)],
        previousHarvestTokens: [mockBalance(wbtc, 0.0047)],
        duration: ONE_DAY_MS * 15,
        lastMeasuredAt: referenceTime - ONE_DAY_MS * 15,
        lastReportedAt: 0,
        lastHarvestedAt: referenceTime - ONE_DAY_MS * 30,
      };
      const result = getVaultYieldProjection(mockVault, yieldSources, mockYieldEstimate);
      expect(result).toMatchSnapshot();
    });
  });
});
