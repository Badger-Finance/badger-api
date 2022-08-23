import { Protocol, VaultBehavior, VaultDTO, VaultType, VaultVersion } from '@badger-dao/sdk';
import { BadRequest, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';

import * as dynamoDbUtils from '../aws/dynamodb.utils';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { Chain } from '../chains/config/chain.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { SourceType } from '../rewards/enums/source-type.enum';
import * as rewardsUtils from '../rewards/rewards.utils';
import { MOCK_TOKEN, MOCK_TOKENS, MOCK_VAULT, MOCK_VAULT_DEFINITION, TEST_ADDR, TEST_TOKEN } from '../test/constants';
import { mockBalance, mockQuery, randomSnapshot, setupMockChain } from '../test/mocks.utils';
import { TokenNotFound } from '../tokens/errors/token.error';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokensUtils from '../tokens/tokens.utils';
import { VAULT_SOURCE } from './vaults.config';
import {
  defaultVault,
  estimateDerivativeEmission,
  getCachedVault,
  getVaultPerformance,
  getVaultTokenPrice,
  queryYieldEstimate,
  queryYieldSources,
} from './vaults.utils';
import * as yieldsUtils from './yields.utils';

describe('vaults.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
    jest.spyOn(console, 'error').mockImplementation(jest.fn);
  });

  describe('defaultVault', () => {
    it('returns a vault with default values', async () => {
      const depositToken = fullTokenMockMap[MOCK_VAULT_DEFINITION.depositToken];
      const settToken = fullTokenMockMap[MOCK_VAULT_DEFINITION.address];
      const expected: VaultDTO = {
        asset: depositToken.symbol,
        vaultAsset: settToken.symbol,
        state: MOCK_VAULT_DEFINITION.state,
        apr: 0,
        apy: 0,
        minApr: 0,
        minApy: 0,
        maxApr: 0,
        maxApy: 0,
        balance: 0,
        available: 0,
        boost: {
          enabled: false,
          weight: 0,
        },
        bouncer: MOCK_VAULT_DEFINITION.bouncer ?? BouncerType.None,
        name: MOCK_VAULT_DEFINITION.name,
        protocol: Protocol.Badger,
        pricePerFullShare: 1,
        sources: [],
        sourcesApy: [],
        tokens: [],
        underlyingToken: MOCK_VAULT_DEFINITION.depositToken,
        value: 0,
        vaultToken: MOCK_VAULT_DEFINITION.address,
        strategy: {
          address: ethers.constants.AddressZero,
          withdrawFee: 0,
          performanceFee: 0,
          strategistFee: 0,
          aumFee: 0,
        },
        type: MOCK_VAULT_DEFINITION.protocol === Protocol.Badger ? VaultType.Native : VaultType.Standard,
        behavior: MOCK_VAULT_DEFINITION.behavior ?? VaultBehavior.None,
        lastHarvest: 0,
        yieldProjection: {
          yieldApr: 0,
          yieldTokens: [],
          yieldPeriodApr: 0,
          yieldPeriodSources: [],
          yieldValue: 0,
          harvestApr: 0,
          harvestPeriodApr: 0,
          harvestPeriodApy: 0,
          harvestTokens: [],
          harvestPeriodSources: [],
          harvestPeriodSourcesApy: [],
          harvestValue: 0,
          nonHarvestApr: 0,
          nonHarvestApy: 0,
          nonHarvestSources: [],
          nonHarvestSourcesApy: [],
        },
        version: VaultVersion.v1,
      };
      const actual = await defaultVault(chain, MOCK_VAULT_DEFINITION);
      expect(actual).toMatchObject(expected);
    });
  });

  describe('getCachedVault', () => {
    beforeEach(() => {
      jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_c, token) => MOCK_TOKENS[token]);
      jest
        .spyOn(tokensUtils, 'getVaultTokens')
        .mockImplementation(async (_c, _v) => [mockBalance(MOCK_TOKENS[TEST_ADDR], 42_069)]);
    });

    describe('encounters an error', () => {
      it('returns the default vault', async () => {
        jest.spyOn(dynamoDbUtils, 'getDataMapper').mockImplementationOnce(() => {
          throw new Error('Expected test error: getCachedVault error');
        });
        const cached = await getCachedVault(chain, MOCK_VAULT_DEFINITION);
        const defaultVaultInst = await defaultVault(chain, MOCK_VAULT_DEFINITION);
        expect(cached).toMatchObject(defaultVaultInst);
      });
    });

    describe('no cached vault exists', () => {
      it('returns the default vault', async () => {
        mockQuery([]);
        const cached = await getCachedVault(chain, MOCK_VAULT_DEFINITION);
        const defaultVaultInst = await defaultVault(chain, MOCK_VAULT_DEFINITION);
        expect(cached).toMatchObject(defaultVaultInst);
      });
    });

    describe('a cached vault exists', () => {
      it('returns the vault', async () => {
        const snapshot = randomSnapshot(MOCK_VAULT_DEFINITION);
        mockQuery([snapshot]);
        const cached = await getCachedVault(chain, MOCK_VAULT_DEFINITION);
        const expected = await defaultVault(chain, MOCK_VAULT_DEFINITION);
        expected.tokens = [mockBalance(MOCK_TOKENS[TEST_ADDR], 42_069)];
        expected.available = snapshot.available;
        expected.pricePerFullShare = snapshot.balance / snapshot.totalSupply;
        expected.balance = snapshot.balance;
        expected.value = snapshot.value;
        expected.boost = {
          enabled: snapshot.boostWeight > 0,
          weight: snapshot.boostWeight,
        };
        expect(cached).toMatchObject(expected);
      });
    });
  });

  describe('getVaultTokenPrice', () => {
    describe('look up non vault token price', () => {
      it('throws a bad request error', async () => {
        await expect(getVaultTokenPrice(chain, TEST_TOKEN)).rejects.toThrow(BadRequest);
      });
    });

    describe('look up unknown token', () => {
      it('throws a token not found error', async () => {
        await expect(getVaultTokenPrice(chain, ethers.constants.AddressZero)).rejects.toThrow(TokenNotFound);
      });
    });

    describe('look up malformed token configuration', () => {
      it('throws an unprocessable entity error', async () => {
        const tokenCopy = JSON.parse(JSON.stringify(MOCK_TOKEN));
        tokenCopy.type = PricingType.Vault;
        jest.spyOn(tokensUtils, 'getFullToken').mockImplementation(async (_c, _t) => tokenCopy);
        await expect(getVaultTokenPrice(chain, TEST_ADDR)).rejects.toThrow(UnprocessableEntity);
      });
    });

    describe('look up valid, properly configured vault', () => {
      it('returns a valid token price for the vault base on price per full share', async () => {
        mockQuery([MOCK_VAULT]);
        const expected = await chain.strategy.getPrice(MOCK_VAULT_DEFINITION.depositToken);
        expected.address = MOCK_VAULT_DEFINITION.address;
        expected.price *= MOCK_VAULT.pricePerFullShare;
        const vaultPrice = await getVaultTokenPrice(chain, MOCK_VAULT_DEFINITION.address);
        expect(vaultPrice).toMatchObject(expected);
      });
    });
  });

  describe('getVaultPerformance', () => {
    describe('no rewards or harvests', () => {
      it('returns no value sources', async () => {
        jest.spyOn(yieldsUtils, 'loadVaultEventPerformances').mockImplementation(async () => []);
        const graphMock = jest.spyOn(yieldsUtils, 'loadVaultGraphPerformances');
        jest.spyOn(rewardsUtils, 'getRewardEmission').mockImplementation(async () => []);
        jest.spyOn(rewardsUtils, 'getProtocolValueSources').mockImplementation(async () => []);
        const result = await getVaultPerformance(chain, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
        expect(graphMock.mock.calls.length).toEqual(0);
      });
    });

    describe('error getting on chain events', () => {
      it('attempts to load data from the graph', async () => {
        jest.spyOn(yieldsUtils, 'loadVaultEventPerformances').mockImplementation(async () => {
          throw new Error('Expected test error: on chain event failure');
        });
        jest
          .spyOn(yieldsUtils, 'loadVaultGraphPerformances')
          .mockImplementation(async () => [
            yieldsUtils.createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Distribution, 'Graph Badger', 10.3),
          ]);
        jest.spyOn(rewardsUtils, 'getRewardEmission').mockImplementation(async () => []);
        jest.spyOn(rewardsUtils, 'getProtocolValueSources').mockImplementation(async () => []);
        const result = await getVaultPerformance(chain, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      });
    });

    describe('evaluate vaults with emissions or third party yield', () => {
      it('includes protocol reward emissions and additional yield sources', async () => {
        jest.spyOn(yieldsUtils, 'loadVaultEventPerformances').mockImplementation(async () => []);
        jest.spyOn(yieldsUtils, 'loadVaultGraphPerformances').mockImplementation(async () => []);
        jest.spyOn(rewardsUtils, 'getRewardEmission').mockImplementation(async () => [
          yieldsUtils.createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Emission, 'Badger', 1.3),
          yieldsUtils.createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Emission, 'Boosted Badger', 6.9, {
            min: 0.2,
            max: 4,
          }),
        ]);
        jest
          .spyOn(rewardsUtils, 'getProtocolValueSources')
          .mockImplementation(async () => [
            yieldsUtils.createYieldSource(MOCK_VAULT_DEFINITION, SourceType.TradeFee, 'Curve LP Fee', 0.03),
          ]);
        const result = await getVaultPerformance(chain, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('estimateDerivativeEmission', () => {
    it.each([
      // enumerate all test cases above / below 100% apr
      [3.4883, 6.7204, 6.7204, 94.20314377878076],
      [3.4883, 6.7204, 0.7204, 12.45153507752425],
      [3.4883, 0.7204, 6.7204, 80.69651967371782],
      [3.4883, 0.7204, 0.7204, 3.529515865690866],
      [0.4883, 6.7204, 6.7204, 98.7771522235121],
      [0.4883, 6.7204, 0.7204, 26.1556767065858],
      [0.4883, 0.7204, 0.7204, 13.257249960438303],
    ])(
      'Estimates derived emission from (%d compound, %d emission, %d compound emission) as %d%%',
      (compound, emission, compoundEmission, expected) => {
        expect(estimateDerivativeEmission(compound, emission, compoundEmission)).toEqual(expected);
      },
    );
  });

  describe('queryYieldSources', () => {
    describe('encounters an error', () => {
      it('returns an empty list', async () => {
        jest.spyOn(dynamoDbUtils, 'getDataMapper').mockImplementationOnce(() => {
          throw new Error('Expected test error: queryYieldSources error');
        });
        const result = await queryYieldSources(MOCK_VAULT_DEFINITION);
        expect(result).toMatchObject([]);
      });
    });

    describe('no yield sources exists', () => {
      it('returns an empty list', async () => {
        mockQuery([]);
        const result = await queryYieldSources(MOCK_VAULT_DEFINITION);
        expect(result).toMatchObject([]);
      });
    });

    describe('system has saved data', () => {
      it('returns the cached yield sources', async () => {
        const expected = [
          yieldsUtils.createYieldSource(MOCK_VAULT_DEFINITION, SourceType.PreCompound, VAULT_SOURCE, 8),
          yieldsUtils.createYieldSource(MOCK_VAULT_DEFINITION, SourceType.Compound, VAULT_SOURCE, 10),
        ];
        mockQuery(expected);
        const result = await queryYieldSources(MOCK_VAULT_DEFINITION);
        expect(result).toMatchObject(expected);
      });
    });
  });

  describe('queryYieldEstimate', () => {
    const defaultExpectedMock: YieldEstimate = {
      vault: MOCK_VAULT_DEFINITION.address,
      yieldTokens: [],
      harvestTokens: [],
      lastHarvestedAt: 0,
      previousYieldTokens: [],
      previousHarvestTokens: [],
      lastMeasuredAt: 0,
      duration: 0,
      lastReportedAt: 0,
    };

    describe('encounters an error', () => {
      it('returns the default projection', async () => {
        jest.spyOn(dynamoDbUtils, 'getDataMapper').mockImplementationOnce(() => {
          throw new Error('Expected test error: queryYieldEstimate error');
        });
        const result = await queryYieldEstimate(MOCK_VAULT_DEFINITION);
        expect(result).toMatchObject(defaultExpectedMock);
      });
    });

    describe('no projection exists', () => {
      it('returns the default projection', async () => {
        mockQuery([]);
        const result = await queryYieldEstimate(MOCK_VAULT_DEFINITION);
        expect(result).toMatchObject(defaultExpectedMock);
      });
    });

    describe('system has saved data', () => {
      it('returns the cached yield projection', async () => {
        const cachedYield: YieldEstimate = {
          vault: MOCK_VAULT_DEFINITION.address,
          yieldTokens: [mockBalance(fullTokenMockMap[TEST_TOKEN], 1)],
          harvestTokens: [mockBalance(fullTokenMockMap[TEST_TOKEN], 1)],
          lastHarvestedAt: 0,
          previousYieldTokens: [mockBalance(fullTokenMockMap[TEST_TOKEN], 0.998)],
          previousHarvestTokens: [mockBalance(fullTokenMockMap[TEST_TOKEN], 0.998)],
          lastMeasuredAt: 0,
          duration: 68400,
          lastReportedAt: 0,
        };
        mockQuery([cachedYield]);
        const result = await queryYieldEstimate(MOCK_VAULT_DEFINITION);
        expect(result).toMatchObject(cachedYield);
      });
    });
  });
});
