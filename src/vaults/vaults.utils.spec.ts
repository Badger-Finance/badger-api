import BadgerSDK, {
  BadgerGraph,
  ONE_YEAR_MS,
  Protocol,
  TokensService,
  VaultBehavior,
  VaultDTO,
  VaultsService,
  VaultStatus,
  VaultType,
  VaultVersion,
} from '@badger-dao/sdk';
import * as gqlGenT from '@badger-dao/sdk/lib/graphql/generated/badger';
import { BadRequest } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';

import { Polygon } from '../chains/config/polygon.config';
import { ONE_DAY_SECONDS } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import * as indexerUtils from '../indexers/indexer.utils';
import * as pricesUtils from '../prices/prices.utils';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { SourceType } from '../rewards/enums/source-type.enum';
import * as rewardsUtils from '../rewards/rewards.utils';
import {
  randomSnapshot,
  randomSnapshots,
  setFullTokenDataMock,
  setupMapper,
  TEST_ADDR,
  TEST_CHAIN,
} from '../test/tests.utils';
import { TokenNotFound } from '../tokens/errors/token.error';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { tokenEmission } from '../tokens/tokens.utils';
import * as tokenUtils from '../tokens/tokens.utils';
import { vaultsGraphSdkMapMock } from './mocks/vaults-graph-sdk-map.mock';
import { vaultsHarvestsSdkMock } from './mocks/vaults-harvests-sdk.mock';
import {
  defaultVault,
  estimateDerivativeEmission,
  getCachedVault,
  getVaultHarvestsOnChain,
  getVaultPerformance,
  getVaultTokenPrice,
  getVaultUnderlyingPerformance,
  VAULT_SOURCE,
} from './vaults.utils';
import { MOCK_VAULT_DEFINITION } from '../test/constants';

describe('vaults.utils', () => {
  beforeEach(() => {
    console.log = jest.fn();

    jest.spyOn(BadgerGraph.prototype, 'loadSettHarvests').mockImplementation(async (_options) => {
      const harvests = [
        {
          id: '',
          blockNumber: '10',
          timestamp: 1640159886,
          amount: '80000000000000000000',
          token: {
            id: '',
            symbol: '',
            name: '',
            decimals: '',
            totalSupply: '',
          },
        },
        {
          id: '',
          blockNumber: '10',
          timestamp: 1642159886,
          amount: '100000000000000000000',
          token: {
            id: '',
            symbol: '',
            name: '',
            decimals: '',
            totalSupply: '',
          },
        },
        {
          id: '',
          blockNumber: '10',
          timestamp: 1645159886,
          amount: '125000000000000000000',
          token: {
            id: '',
            symbol: '',
            name: '',
            decimals: '',
            totalSupply: '',
          },
        },
      ];
      return {
        settHarvests: harvests,
      };
    });
    jest.spyOn(BadgerGraph.prototype, 'loadBadgerTreeDistributions').mockImplementation(async () => ({
      badgerTreeDistributions: [],
    }));
    jest.spyOn(TokensService.prototype, 'loadToken').mockImplementation(async (address) => ({
      address,
      decimals: 18,
      symbol: 'TEST',
      name: 'TEST',
    }));
    const snapshot = randomSnapshot(MOCK_VAULT_DEFINITION);
    snapshot.value = 1000;
    snapshot.balance = 10000;
    setupMapper([snapshot]);
    jest.spyOn(indexerUtils, 'getVault').mockImplementation(async (_chain, _address) => ({
      sett: {
        id: TEST_ADDR,
        balance: '2500000000000000000000', // 2500
        available: 0,
        netDeposit: 0,
        netShareDeposit: 0,
        token: {
          symbol: 'TEST',
          name: 'TEST',
          id: TEST_ADDR,
          decimals: 18,
          totalSupply: 3,
        },
        pricePerFullShare: 1,
        totalSupply: 10,
        symbol: 'TEST',
        name: 'TEST',
        decimals: 18,
        grossDeposit: 1,
        grossShareDeposit: 1,
        grossShareWithdraw: 1,
        grossWithdraw: 1,
        strategy: {
          id: TEST_ADDR,
          balance: '2500000000000000000000',
        },
        version: VaultVersion.v1_5,
        status: VaultStatus.guarded,
        isProduction: true,
        protocol: Protocol.Badger,
        createdAt: 0,
        behavior: VaultBehavior.Compounder,
        lastUpdatedAt: 0,
        releasedAt: 0,
      },
    }));
    jest.spyOn(rewardsUtils, 'getProtocolValueSources').mockImplementation(async (_chain, _vault) => {
      const rewardSource = createValueSource('Test LP Fees', 1.13);
      return [rewardsUtils.valueSourceToCachedValueSource(rewardSource, MOCK_VAULT_DEFINITION, SourceType.TradeFee)];
    });
  });

  function setupSdk() {
    jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (opts) => {
      if (!opts.timestamp_gte) {
        throw new Error('Invalid request!');
      }
      const startTime = opts.timestamp_gte;
      const data = [0, 1, 2].map((int) => {
        const timestamp = Number((startTime + int * ONE_DAY_SECONDS * 14).toFixed());
        const block = Number((timestamp / 10000).toFixed());
        return {
          timestamp,
          harvests: [
            { timestamp, block, token: TOKENS.CRV_IBBTC, amount: BigNumber.from((int + 1 * 1.88e18).toString()) },
          ],
          treeDistributions: [
            { timestamp, block, token: TOKENS.BCVXCRV, amount: BigNumber.from((int + 1 * 5.77e12).toString()) },
            { timestamp, block, token: TOKENS.BVECVX, amount: BigNumber.from((int + 1 * 4.42e12).toString()) },
          ],
        };
      });
      return { data };
    });
  }

  beforeEach(() => {
    jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();
    jest.spyOn(rewardsUtils, 'getRewardEmission').mockImplementation(async (_chain, _vault) => {
      const rewardSource = createValueSource('Badger Rewards', 6.969);
      return [
        rewardsUtils.valueSourceToCachedValueSource(
          rewardSource,
          MOCK_VAULT_DEFINITION,
          tokenEmission(fullTokenMockMap[TOKENS.BBADGER], true),
        ),
      ];
    });
  });

  const setupTestVaultHarvests = (): void => {
    jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
      return fullTokenMockMap[tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
    });
    // eslint-disable-next-line
    jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async ({ address }): Promise<any> => {
      return vaultsHarvestsSdkMock[address];
    });
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    jest
      .spyOn(BadgerGraph.prototype, 'loadSett')
      .mockImplementation(async ({ id, block }): Promise<gqlGenT.SettQuery> => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return vaultsGraphSdkMapMock[`${id.toLowerCase()}-${(block || {}).number || 0}`];
      });
    jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();
  };

  describe('defaultVault', () => {
    it('returns a sett default fields', async () => {
      const depositToken = fullTokenMockMap[MOCK_VAULT_DEFINITION.depositToken];
      const settToken = fullTokenMockMap[MOCK_VAULT_DEFINITION.address];
      const expected: VaultDTO = {
        asset: depositToken.symbol,
        vaultAsset: settToken.symbol,
        state: MOCK_VAULT_DEFINITION.state,
        apr: 0,
        apy: 0,
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
          withdrawFee: 50,
          performanceFee: 20,
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
          yieldTokensPerPeriod: [],
          yieldValue: 0,
          harvestApr: 0,
          harvestApy: 0,
          harvestPeriodApr: 0,
          harvestPeriodApy: 0,
          harvestTokens: [],
          harvestTokensPerPeriod: [],
          harvestValue: 0,
        },
        version: VaultVersion.v1,
      };
      setFullTokenDataMock();
      const actual = await defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
      expect(actual).toMatchObject(expected);
    });
  });

  describe('getCachedVault', () => {
    describe('no cached vault exists', () => {
      it('returns the default sett', async () => {
        setupMapper([]);
        setFullTokenDataMock();
        const cached = await getCachedVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
        const defaultVaultInst = await defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
        expect(cached).toMatchObject(defaultVaultInst);
      });
    });

    describe('a cached vault exists', () => {
      it('returns the vault', async () => {
        const snapshot = randomSnapshot(MOCK_VAULT_DEFINITION);
        setupMapper([snapshot]);
        setFullTokenDataMock();

        const cached = await getCachedVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
        const expected = await defaultVault(TEST_CHAIN, MOCK_VAULT_DEFINITION);
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
        setFullTokenDataMock();
        await expect(getVaultTokenPrice(TEST_CHAIN, TOKENS.BADGER)).rejects.toThrow(BadRequest);
      });
    });

    describe('look up malformed token configuration', () => {
      it('throws an unprocessable entity error', async () => {
        setFullTokenDataMock();
        await expect(getVaultTokenPrice(TEST_CHAIN, TEST_ADDR)).rejects.toThrow(TokenNotFound);
      });
    });

    describe('look up valid, properly configured vault', () => {
      it('returns a valid token price for the vault base on price per full share', async () => {
        const snapshot = randomSnapshot(MOCK_VAULT_DEFINITION);
        setupMapper([snapshot]);
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (address) => ({ address, price: 10 }));
        setFullTokenDataMock();
        const vaultPrice = await getVaultTokenPrice(TEST_CHAIN, MOCK_VAULT_DEFINITION.address);
        expect(vaultPrice).toMatchObject({
          address: MOCK_VAULT_DEFINITION.address,
          price: 10 * snapshot.pricePerFullShare,
        });
      });
    });
  });

  describe('getVaultPerformance', () => {
    describe('no rewards or harvests', () => {
      it('returns value sources from fallback methods', async () => {
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => ({ data: [] }));
        setFullTokenDataMock();
        const result = await getVaultPerformance(TEST_CHAIN, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      });
    });

    describe('requests non standard vault performance', () => {
      it('returns value sources from fallback methods', async () => {
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => {
          throw new Error('Incompatible vault!');
        });
        setupMapper(randomSnapshots(MOCK_VAULT_DEFINITION));
        setFullTokenDataMock();
        const result = await getVaultPerformance(TEST_CHAIN, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      });
    });

    describe('requests non compatible network vault performances', () => {
      it('returns value sources from fallback methods', async () => {
        const alternateChain = new Polygon();
        setFullTokenDataMock();
        const result = await getVaultPerformance(alternateChain, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      });
    });

    describe('requests standard vault performance', () => {
      it('returns value sources from standard methods', async () => {
        setupSdk();
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token) => ({
          address: token,
          price: Number(token.slice(0, 4)),
        }));
        const underlying = createValueSource(VAULT_SOURCE, 10);
        setupMapper([
          rewardsUtils.valueSourceToCachedValueSource(underlying, MOCK_VAULT_DEFINITION, SourceType.PreCompound),
        ]);
        setFullTokenDataMock();
        const result = await getVaultPerformance(TEST_CHAIN, MOCK_VAULT_DEFINITION);
        expect(result).toMatchSnapshot();
      });

      it('skips all emitted tokens with no price', async () => {
        setupSdk();
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token) => {
          if (token !== MOCK_VAULT_DEFINITION.depositToken) {
            return {
              address: token,
              price: 0,
            };
          }
          return {
            address: token,
            price: Number(token.slice(0, 4)),
          };
        });
        setFullTokenDataMock();
        const result = await getVaultPerformance(TEST_CHAIN, MOCK_VAULT_DEFINITION);
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

  describe('getVaultUnderlyingPerformance', () => {
    it('returns 0 for no pricePerFullShare increase', async () => {
      const snapshot = randomSnapshot(MOCK_VAULT_DEFINITION);
      setupMapper([snapshot]);
      setFullTokenDataMock();
      const result = await getVaultUnderlyingPerformance(TEST_CHAIN, MOCK_VAULT_DEFINITION);
      result.forEach((r) => expect(r.apr).toEqual(0));
    });

    it('returns expected apr for increase in pricePerFullShare', async () => {
      const snapshots = randomSnapshots(MOCK_VAULT_DEFINITION);
      setupMapper(snapshots);
      const duration = snapshots[0].timestamp - snapshots[snapshots.length - 1].timestamp;
      const deltaPpfs = snapshots[0].pricePerFullShare - snapshots[snapshots.length - 1].pricePerFullShare;
      const expected = (deltaPpfs / snapshots[snapshots.length - 1].pricePerFullShare) * (ONE_YEAR_MS / duration) * 100;
      setFullTokenDataMock();
      const result = await getVaultUnderlyingPerformance(TEST_CHAIN, MOCK_VAULT_DEFINITION);
      result.forEach((r) => expect(r.apr).toEqual(expected));
    });
  });

  describe('getVaultHarvestsOnChain', () => {
    const TEST_VAULT = TOKENS.BCRV_SBTC;

    it('returns vaults harvests with apr', async () => {
      setupTestVaultHarvests();
      expect(await getVaultHarvestsOnChain(TEST_CHAIN, TEST_VAULT)).toMatchSnapshot();
    });

    it('returns empty harvests for unknown vault', async () => {
      setupTestVaultHarvests();
      await expect(getVaultHarvestsOnChain(TEST_CHAIN, '0x000000000000')).rejects.toThrow(Error);
    });
  });
});
