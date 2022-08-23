import { ONE_DAY_MS, VaultState } from '@badger-dao/sdk';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION } from '../test/constants';
import { mockBalance, mockQuery, setupMockChain } from '../test/mocks.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { VAULT_SOURCE } from './vaults.config';
import {
  calculateYield,
  createYieldSource,
  getVaultYieldProjection,
  getYieldSources,
  loadVaultEventPerformances,
} from './yields.utils';
// import * as tokensUtils from '../tokens/tokens.utils';

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

  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

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

  describe('loadVaultEventPerformances', () => {
    describe('requests an influence vault', () => {
      it('throws a bad request', async () => {
        const mockVault = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
        mockVault.address = TOKENS.BVECVX;
        expect(loadVaultEventPerformances(chain, mockVault)).rejects.toThrow(
          'Vault utilizes external harvest processor, not compatible with event lookup',
        );
      });
    });

    // TODO: enable once mocks are updated
    // describe('requests a standard vault', () => {
    //   it('provides evaluated yield data', async () => {
    //     jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_c, t) => MOCK_TOKENS[t]);
    //     const result = await loadVaultEventPerformances(chain, MOCK_VAULT_DEFINITION);
    //     expect(result).toMatchSnapshot();
    //   });
    // })
  });
});
