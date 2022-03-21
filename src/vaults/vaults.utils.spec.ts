import BadgerSDK, {
  BadgerGraph,
  Protocol,
  TokensService,
  VaultBehavior,
  VaultDTO,
  VaultsService,
  VaultState,
  VaultType,
} from '@badger-dao/sdk';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { TOKENS } from '../config/tokens.config';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import {
  randomVault,
  randomSnapshot,
  setupMapper,
  TEST_CHAIN,
  TEST_ADDR,
  randomSnapshots,
  setFullTokenDataMock,
} from '../test/tests.utils';
import {
  defaultVault,
  estimateDerivativeEmission,
  getCachedVault,
  getVaultDefinition,
  getVaultPerformance,
  getVaultTokenPrice,
  getVaultUnderlyingPerformance,
  VAULT_SOURCE,
} from './vaults.utils';
import * as pricesUtils from '../prices/prices.utils';
import * as rewardsUtils from '../rewards/rewards.utils';
import * as protocolsUtils from '../protocols/protocols.utils';
import * as indexerUtils from '../indexers/indexer.utils';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { tokenEmission } from '../protocols/protocols.utils';
import { Polygon } from '../chains/config/polygon.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { ONE_DAY_SECONDS, ONE_YEAR_MS } from '../config/constants';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { TokenNotFound } from '../tokens/errors/token.error';

describe('vaults.utils', () => {
  const vault = getVaultDefinition(TEST_CHAIN, TOKENS.BBADGER);

  beforeEach(() => {
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
    const snapshot = randomSnapshot(vault);
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
      },
    }));
    jest.spyOn(rewardsUtils, 'getProtocolValueSources').mockImplementation(async (_chain, _vault) => {
      const rewardSource = createValueSource('Test LP Fees', 1.13);
      return [rewardsUtils.valueSourceToCachedValueSource(rewardSource, vault, SourceType.TradeFee)];
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
    const vault = getVaultDefinition(TEST_CHAIN, TOKENS.BBADGER);
    jest.spyOn(rewardsUtils, 'getRewardEmission').mockImplementation(async (_chain, _vault) => {
      const rewardSource = createValueSource('Badger Rewards', 6.969);
      return [
        rewardsUtils.valueSourceToCachedValueSource(
          rewardSource,
          vault,
          tokenEmission(fullTokenMockMap[TOKENS.BBADGER], true),
        ),
      ];
    });
  });

  describe('defaultVault', () => {
    it('returns a sett default fields', async () => {
      const vaultDefinition = randomVault();

      const depositToken = fullTokenMockMap[vaultDefinition.depositToken];
      const settToken = fullTokenMockMap[vaultDefinition.vaultToken];
      const expected: VaultDTO = {
        asset: depositToken.symbol,
        vaultAsset: settToken.symbol,
        state: vaultDefinition.state
          ? vaultDefinition.state
          : vaultDefinition.newVault
          ? VaultState.New
          : VaultState.Open,
        apr: 0,
        apy: 0,
        balance: 0,
        available: 0,
        boost: {
          enabled: false,
          weight: 0,
        },
        bouncer: vaultDefinition.bouncer ?? BouncerType.None,
        name: vaultDefinition.name,
        protocol: Protocol.Badger,
        pricePerFullShare: 1,
        sources: [],
        sourcesApy: [],
        tokens: [],
        underlyingToken: vaultDefinition.depositToken,
        value: 0,
        vaultToken: vaultDefinition.vaultToken,
        strategy: {
          address: ethers.constants.AddressZero,
          withdrawFee: 50,
          performanceFee: 20,
          strategistFee: 0,
        },
        type: vaultDefinition.protocol === Protocol.Badger ? VaultType.Native : VaultType.Standard,
        behavior: vaultDefinition.behavior ?? VaultBehavior.None,
        lastHarvest: 0,
        yieldProjection: {
          yieldApr: 0,
          yieldTokens: [],
          yieldValue: 0,
          harvestApr: 0,
          harvestApy: 0,
          harvestTokens: [],
          harvestValue: 0,
        },
      };
      setFullTokenDataMock();
      const actual = await defaultVault(TEST_CHAIN, vaultDefinition);
      expect(actual).toMatchObject(expected);
    });
  });

  describe('getCachedVault', () => {
    describe('no cached vault exists', () => {
      it('returns the default sett', async () => {
        setupMapper([]);
        const vaultDefinition = randomVault();
        setFullTokenDataMock();
        const cached = await getCachedVault(TEST_CHAIN, vaultDefinition);
        const defaultVaultInst = await defaultVault(TEST_CHAIN, vaultDefinition);
        expect(cached).toMatchObject(defaultVaultInst);
      });
    });

    describe('a cached vault exists', () => {
      it('returns the vault', async () => {
        const vault = randomVault();
        const snapshot = randomSnapshot(vault);
        setupMapper([snapshot]);
        setFullTokenDataMock();

        const cached = await getCachedVault(TEST_CHAIN, vault);
        const expected = await defaultVault(TEST_CHAIN, vault);
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

  describe('getVaultDefinition', () => {
    describe('for an existing sett', () => {
      it('returns the expected sett definition', () => {
        const expected = TEST_CHAIN.vaults[Math.floor(Math.random() * TEST_CHAIN.vaults.length)];
        const actual = getVaultDefinition(TEST_CHAIN, expected.vaultToken);
        expect(actual).toMatchObject(expected);
      });
    });

    describe('for an existing sett on a different chain', () => {
      it('throws a not found error', () => {
        const expected = TEST_CHAIN.vaults[Math.floor(Math.random() * TEST_CHAIN.vaults.length)];
        expect(() => getVaultDefinition(new BinanceSmartChain(), expected.vaultToken)).toThrow(NotFound);
      });
    });

    describe('for an non existing sett', () => {
      it('throws a not found error', () => {
        const expected = TEST_CHAIN.vaults[Math.floor(Math.random() * TEST_CHAIN.vaults.length)];
        expect(() => getVaultDefinition(TEST_CHAIN, expected.depositToken)).toThrow(NotFound);
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
        const vault = randomVault(TEST_CHAIN);
        const snapshot = randomSnapshot(vault);
        setupMapper([snapshot]);
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (address) => ({ address, price: 10 }));
        setFullTokenDataMock();
        const vaultPrice = await getVaultTokenPrice(TEST_CHAIN, vault.vaultToken);
        expect(vaultPrice).toMatchObject({
          address: vault.vaultToken,
          price: 10 * snapshot.pricePerFullShare,
        });
      });
    });
  });

  describe('getVaultPerformance', () => {
    const vault = getVaultDefinition(TEST_CHAIN, TOKENS.BBADGER);

    describe('no rewards or harvests', () => {
      it('returns value sources from fallback methods', async () => {
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => ({ data: [] }));
        setFullTokenDataMock();
        const result = await getVaultPerformance(TEST_CHAIN, vault);
        expect(result).toMatchSnapshot();
      });
    });

    describe('requests non standard vault performance', () => {
      it('returns value sources from fallback methods', async () => {
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => {
          throw new Error('Incompatible vault!');
        });
        setupMapper(randomSnapshots(vault));
        setFullTokenDataMock();
        const result = await getVaultPerformance(TEST_CHAIN, vault);
        expect(result).toMatchSnapshot();
      });
    });

    describe('requests non compatible network vault performances', () => {
      it('returns value sources from fallback methods', async () => {
        const alternateChain = new Polygon();
        const vault = getVaultDefinition(alternateChain, TOKENS.BMATIC_QUICK_USDC_WBTC);
        setFullTokenDataMock();
        const result = await getVaultPerformance(alternateChain, vault);
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
        jest.spyOn(protocolsUtils, 'getVaultCachedValueSources').mockImplementation(async (vault) => {
          const underlying = createValueSource(VAULT_SOURCE, 10);
          return [rewardsUtils.valueSourceToCachedValueSource(underlying, vault, SourceType.PreCompound)];
        });
        setFullTokenDataMock();
        const result = await getVaultPerformance(TEST_CHAIN, vault);
        expect(result).toMatchSnapshot();
      });

      it('skips all emitted tokens with no price', async () => {
        setupSdk();
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token) => {
          if (token !== vault.depositToken) {
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
        const result = await getVaultPerformance(TEST_CHAIN, vault);
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
      const vault = randomVault();
      const snapshot = randomSnapshot(vault);
      setupMapper([snapshot]);
      setFullTokenDataMock();
      const result = await getVaultUnderlyingPerformance(TEST_CHAIN, vault);
      result.forEach((r) => expect(r.apr).toEqual(0));
    });

    it('returns expected apr for increase in pricePerFullShare', async () => {
      const vault = randomVault();
      const snapshots = randomSnapshots(vault);
      setupMapper(snapshots);
      const duration = snapshots[0].timestamp - snapshots[snapshots.length - 1].timestamp;
      const deltaPpfs = snapshots[0].pricePerFullShare - snapshots[snapshots.length - 1].pricePerFullShare;
      const expected = (deltaPpfs / snapshots[snapshots.length - 1].pricePerFullShare) * (ONE_YEAR_MS / duration) * 100;
      setFullTokenDataMock();
      const result = await getVaultUnderlyingPerformance(TEST_CHAIN, vault);
      result.forEach((r) => expect(r.apr).toEqual(expected));
    });
  });
});
