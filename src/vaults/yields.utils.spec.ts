import { ONE_DAY_MS, Vault, Vault__factory, VaultState } from '@badger-dao/sdk';
import { BigNumber } from 'ethers';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import * as pricesUtils from '../prices/prices.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { MOCK_TOKENS, MOCK_VAULT, MOCK_VAULT_DEFINITION, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { mockBalance, mockQuery, setupMockChain } from '../test/mocks.utils';
import { mockContract } from '../test/mocks.utils/contracts/mock.contract.base';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokensUtils from '../tokens/tokens.utils';
import * as influenceUtils from '../vaults/influence.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { VAULT_SOURCE } from './vaults.config';
import {
  calculateYield,
  createYieldSource,
  getVaultYieldProjection,
  getYieldSources,
  loadVaultEventPerformances,
  loadVaultGraphPerformances,
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

  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  function setupYieldMocks() {
    // setup token responses
    jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_c, t) => MOCK_TOKENS[t]);
    jest.spyOn(pricesUtils, 'queryPriceAtTimestamp').mockImplementation(async (token, _t, _c) => {
      const basePrice = await chain.strategy.getPrice(token);
      return {
        ...basePrice,
        updatedAt: TEST_CURRENT_TIMESTAMP,
      };
    });

    // setup contract interactions
    const vaultMock = mockContract<Vault>(Vault__factory);
    jest.spyOn(vaultMock, 'totalSupply').mockImplementation(async (_o) => BigNumber.from('10000000000000000000000000'));

    jest
      .spyOn(vaultsUtils, 'queryYieldSources')
      .mockImplementation(async (v) => [createYieldSource(v, SourceType.PreCompound, VAULT_SOURCE, 3)]);
  }

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

    describe('requests a standard vault', () => {
      it('provides evaluated yield data', async () => {
        setupYieldMocks();
        const result = await loadVaultEventPerformances(chain, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('loadVaultGraphPerformances', () => {
    describe('requests an influence vault', () => {
      it('throws a bad request', async () => {
        const mockVault = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
        mockVault.address = TOKENS.BVECVX;
        setupYieldMocks();

        jest.spyOn(influenceUtils, 'getInfuelnceVaultYieldBalance').mockImplementation(async (_c, _v) => 4_500_000);
        jest.spyOn(chain.sdk.graph, 'loadSettHarvests').mockImplementation(async () => ({
          settHarvests: [
            {
              id: '0x56c8c982ce6efa45da0ff90383d42cc026397f3bceac93fa3c08d264aad1863c-106',
              timestamp: 1660107820,
              token: {
                id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
                name: 'Convex Token',
                symbol: 'CVX',
                decimals: '18',
                totalSupply: '52842757666481041544194387',
              },
              amount: '0',
              blockNumber: '15312417',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x6902d5e3d0dc784dac28506ec173727111439ba5dd8a05cfb9c9a7f86137cab5-51',
              timestamp: 1661148573,
              token: {
                id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
                name: 'Convex Token',
                symbol: 'CVX',
                decimals: '18',
                totalSupply: '52842757666481041544194387',
              },
              amount: '0',
              blockNumber: '15388629',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x74f208d906f022f2ed290dfc01c9b283791ae3352f74638cbdd8b6af57323304-26',
              timestamp: 1660455256,
              token: {
                id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
                name: 'Convex Token',
                symbol: 'CVX',
                decimals: '18',
                totalSupply: '52842757666481041544194387',
              },
              amount: '0',
              blockNumber: '15337891',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0xba80fa9bdd08636514171ee7c54d6a5420d392111c4b08fa185e9677fea5d647-44',
              timestamp: 1660800880,
              token: {
                id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
                name: 'Convex Token',
                symbol: 'CVX',
                decimals: '18',
                totalSupply: '52842757666481041544194387',
              },
              amount: '0',
              blockNumber: '15363244',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
          ],
        }));
        jest.spyOn(chain.sdk.graph, 'loadBadgerTreeDistributions').mockImplementation(async () => ({
          badgerTreeDistributions: [
            {
              id: '0x49730f8f1d3aa7915940ec85de53b10e5425cddbf9195c2348f779638eed14dd-85',
              timestamp: 1661253900,
              token: {
                id: '0x0xfd05d3c7fe2924020620a8be4961bbaa747e6305',
                name: 'Badger Vested Escrow Convex Token',
                symbol: 'bveCVX',
                decimals: '18',
                totalSupply: '1146328308588079160439895',
              },
              amount: '18087137228369161871035',
              blockNumber: '15396257',
              strategy: { id: '0x0000000000000000000000000000000000000000' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x49730f8f1d3aa7915940ec85de53b10e5425cddbf9195c2348f779638eed14dd-92',
              timestamp: 1661253900,
              token: {
                id: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
                name: 'Badger',
                symbol: 'BADGER',
                decimals: '18',
                totalSupply: '21000000000000000000000000',
              },
              amount: '8273444229204367267242',
              blockNumber: '15396257',
              strategy: { id: '0x0000000000000000000000000000000000000000' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x56c8c982ce6efa45da0ff90383d42cc026397f3bceac93fa3c08d264aad1863c-105',
              timestamp: 1660107820,
              token: {
                id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
                name: 'Badger Sett Convex CRV',
                symbol: 'bcvxCRV',
                decimals: '18',
                totalSupply: '9680860937976920554007',
              },
              amount: '5603203309292930442532',
              blockNumber: '15312417',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x6902d5e3d0dc784dac28506ec173727111439ba5dd8a05cfb9c9a7f86137cab5-50',
              timestamp: 1661148573,
              token: {
                id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
                name: 'Badger Sett Convex CRV',
                symbol: 'bcvxCRV',
                decimals: '18',
                totalSupply: '9680860937976920554007',
              },
              amount: '4261975371596002775428',
              blockNumber: '15388629',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x74f208d906f022f2ed290dfc01c9b283791ae3352f74638cbdd8b6af57323304-25',
              timestamp: 1660455256,
              token: {
                id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
                name: 'Badger Sett Convex CRV',
                symbol: 'bcvxCRV',
                decimals: '18',
                totalSupply: '9680860937976920554007',
              },
              amount: '4285530143667972615612',
              blockNumber: '15337891',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x99cd95c4fd0c68c963142db17be61a8c2458ff6b5acda3aabe405a644adaee93-178',
              timestamp: 1660132736,
              token: {
                id: '0x0xfd05d3c7fe2924020620a8be4961bbaa747e6305',
                name: 'Badger Vested Escrow Convex Token',
                symbol: 'bveCVX',
                decimals: '18',
                totalSupply: '1146328308588079160439895',
              },
              amount: '18705595517466124968652',
              blockNumber: '15314213',
              strategy: { id: '0x0000000000000000000000000000000000000000' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0x99cd95c4fd0c68c963142db17be61a8c2458ff6b5acda3aabe405a644adaee93-185',
              timestamp: 1660132736,
              token: {
                id: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
                name: 'Badger',
                symbol: 'BADGER',
                decimals: '18',
                totalSupply: '21000000000000000000000000',
              },
              amount: '8418142660217834521465',
              blockNumber: '15314213',
              strategy: { id: '0x0000000000000000000000000000000000000000' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
            {
              id: '0xba80fa9bdd08636514171ee7c54d6a5420d392111c4b08fa185e9677fea5d647-43',
              timestamp: 1660800880,
              token: {
                id: '0x0x2b5455aac8d64c14786c3a29858e43b5945819c0',
                name: 'Badger Sett Convex CRV',
                symbol: 'bcvxCRV',
                decimals: '18',
                totalSupply: '9680860937976920554007',
              },
              amount: '4223102994638643945171',
              blockNumber: '15363244',
              strategy: { id: '0x898111d1f4eb55025d0036568212425ee2274082' },
              sett: { id: '0xfd05d3c7fe2924020620a8be4961bbaa747e6305' },
            },
          ],
        }));

        const result = await loadVaultGraphPerformances(chain, mockVault);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
