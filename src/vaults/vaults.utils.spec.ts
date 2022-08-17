import { Protocol, VaultBehavior, VaultDTO, VaultType, VaultVersion } from '@badger-dao/sdk';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { SourceType } from '../rewards/enums/source-type.enum';
import * as rewardsUtils from '../rewards/rewards.utils';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { randomSnapshot } from '../test/tests.utils';
import { TokenNotFound } from '../tokens/errors/token.error';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import {
  defaultVault,
  estimateDerivativeEmission,
  getCachedVault,
  getVaultPerformance,
  getVaultTokenPrice,
} from './vaults.utils';
import * as yieldsUtils from './yields.utils';

describe('vaults.utils', () => {
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
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
    describe('no cached vault exists', () => {
      it('returns the default sett', async () => {
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
        await expect(getVaultTokenPrice(chain, TOKENS.BADGER)).rejects.toThrow(BadRequest);
      });
    });

    describe('look up malformed token configuration', () => {
      it('throws an unprocessable entity error', async () => {
        await expect(getVaultTokenPrice(chain, ethers.constants.AddressZero)).rejects.toThrow(TokenNotFound);
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
});
