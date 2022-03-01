import BadgerSDK, { Protocol, Vault, VaultsService, VaultState, VaultType } from '@badger-dao/sdk';
import { BadRequest, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { BigNumber, ethers } from 'ethers';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { TOKENS } from '../config/tokens.config';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import {
  randomPerformance,
  randomVault,
  randomSnapshot,
  setupMapper,
  TEST_CHAIN,
  TEST_ADDR,
  randomSnapshots,
} from '../test/tests.utils';
import { getToken } from '../tokens/tokens.utils';
import {
  defaultVault,
  getCachedVault,
  getPerformance,
  getVaultDefinition,
  getVaultPerformance,
  getVaultTokenPrice,
  getVaultUnderlying,
  VAULT_SOURCE,
} from './vaults.utils';
import { PricingType } from '../prices/enums/pricing-type.enum';
import * as pricesUtils from '../prices/prices.utils';
import * as rewardsUtils from '../rewards/rewards.utils';
import * as tokensUtils from '../tokens/tokens.utils';
import * as protocolsUtils from '../protocols/protocols.utils';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { tokenEmission } from '../protocols/protocols.utils';
import { Polygon } from '../chains/config/polygon.config';
import { SourceType } from '../rewards/enums/source-type.enum';
import { ONE_DAY_SECONDS } from '../config/constants';

describe('vaults.utils', () => {
  function setupSdk() {
    const vault = getVaultDefinition(TEST_CHAIN, TOKENS.BBADGER);
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
          harvests: [{ timestamp, block, harvested: BigNumber.from((int + 1 * 1.88e18).toString()) }],
          treeDistributions: [
            { timestamp, block, token: TOKENS.BCVXCRV, amount: BigNumber.from((int + 1 * 5.77e12).toString()) },
            { timestamp, block, token: TOKENS.BVECVX, amount: BigNumber.from((int + 1 * 4.42e12).toString()) },
          ],
        };
      });
      return { data };
    });
    const snapshot = randomSnapshot(vault);
    snapshot.value = 1000;
    snapshot.balance = 10000;
    setupMapper([snapshot]);
  }

  beforeEach(() => {
    jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();
    const vault = getVaultDefinition(TEST_CHAIN, TOKENS.BBADGER);
    jest.spyOn(rewardsUtils, 'getRewardEmission').mockImplementation(async (_chain, _vault) => {
      const rewardSource = createValueSource('Badger Rewards', uniformPerformance(6.969));
      return [
        rewardsUtils.valueSourceToCachedValueSource(rewardSource, vault, tokenEmission(getToken(TOKENS.BBADGER), true)),
      ];
    });
  });

  describe('defaultVault', () => {
    it('returns a sett default fields', () => {
      const vaultDefinition = randomVault();
      const depositToken = getToken(vaultDefinition.depositToken);
      const settToken = getToken(vaultDefinition.vaultToken);
      const expected: Vault = {
        asset: depositToken.symbol,
        vaultAsset: settToken.symbol,
        state: vaultDefinition.state
          ? vaultDefinition.state
          : vaultDefinition.newVault
          ? VaultState.New
          : VaultState.Open,
        apr: 0,
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
        tokens: [],
        underlyingToken: vaultDefinition.depositToken,
        value: 0,
        vaultToken: vaultDefinition.vaultToken,
        strategy: {
          address: ethers.constants.AddressZero,
          withdrawFee: 50,
          performanceFee: 20,
          strategistFee: 10,
        },
        type: VaultType.Standard,
      };
      const actual = defaultVault(vaultDefinition);
      expect(actual).toMatchObject(expected);
    });
  });

  describe('getCachedVault', () => {
    describe('no cached vault exists', () => {
      it('returns the default sett', async () => {
        setupMapper([]);
        const vaultDefinition = randomVault();
        const cached = await getCachedVault(vaultDefinition);
        expect(cached).toMatchObject(defaultVault(vaultDefinition));
      });
    });

    describe('a cached vault exists', () => {
      it('returns the vault sett', async () => {
        const vault = randomVault();
        const snapshot = randomSnapshot(vault);
        setupMapper([snapshot]);
        const cached = await getCachedVault(vault);
        const expected = defaultVault(vault);
        expected.pricePerFullShare = snapshot.balance / snapshot.supply;
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

  describe('getPerformance', () => {
    it('correctly evaluate no change', () => {
      const [current, initial] = randomPerformance();
      current.ratio = 0;
      initial.ratio = 0;
      const performance = getPerformance(current, initial);
      expect(performance).toEqual(0);
    });

    it('correctly evaluate increase', () => {
      const [current, initial] = randomPerformance();
      current.ratio = 1.01;
      initial.ratio = 1;
      const performance = getPerformance(current, initial);
      const expected = 365;
      expect(performance.toFixed(3)).toEqual(expected.toFixed(3));
    });

    it('correctly evaluate decrease', () => {
      const [current, initial] = randomPerformance();
      current.ratio = 1 - 0.03 / 365;
      initial.ratio = 1;
      const performance = getPerformance(current, initial);
      const expected = -3;
      expect(performance.toFixed(3)).toEqual(expected.toFixed(3));
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
        await expect(getVaultTokenPrice(TEST_CHAIN, TOKENS.BADGER)).rejects.toThrow(BadRequest);
      });
    });

    describe('look up malformed token configuration', () => {
      it('throws an unprocessable entity error', async () => {
        jest.spyOn(tokensUtils, 'getToken').mockImplementation(() => ({
          name: 'TEST_TOKEN',
          address: TEST_ADDR,
          decimals: 18,
          symbol: 'TEST',
          type: PricingType.Vault,
        }));
        await expect(getVaultTokenPrice(TEST_CHAIN, TEST_ADDR)).rejects.toThrow(UnprocessableEntity);
      });
    });

    describe('look up valid, properly configured vault', () => {
      it('returns a valid token price for the vault base on price per full share', async () => {
        const vault = randomVault(TEST_CHAIN);
        const snapshot = randomSnapshot(vault);
        setupMapper([snapshot]);
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (address) => ({ address, price: 10 }));
        const vaultPrice = await getVaultTokenPrice(TEST_CHAIN, vault.vaultToken);
        expect(vaultPrice).toMatchObject({
          address: vault.vaultToken,
          price: 10 * snapshot.ratio,
        });
      });
    });
  });

  describe('getVaultUnderlying', () => {
    describe('no snapshots are available', () => {
      it('returns zero apr', async () => {
        setupMapper([]);
        const vault = randomVault();
        const result = await getVaultUnderlying(vault);
        expect(result.apr).toEqual(0);
        expect(result.maxApr).toBeFalsy();
        expect(result.minApr).toBeFalsy();
      });
    });

    describe('full sample period snapshots available', () => {
      it('returns performances for each sample period', async () => {
        const vault = randomVault();
        const snapshots = randomSnapshots(vault);
        setupMapper(snapshots);
        const result = await getVaultUnderlying(vault);
        expect(result.oneDay).toEqual(getPerformance(snapshots[0], snapshots[1]));
        expect(result.threeDay).toEqual(getPerformance(snapshots[0], snapshots[3]));
        expect(result.sevenDay).toEqual(getPerformance(snapshots[0], snapshots[7]));
        expect(result.thirtyDay).toEqual(getPerformance(snapshots[0], snapshots[30]));
      });
    });

    describe('partial sample period snapshots available', () => {
      it('return performances for valid sample periods, and estimates for unavailable data', async () => {
        const vault = randomVault();
        const snapshots = randomSnapshots(vault, 5);
        setupMapper(snapshots);
        const result = await getVaultUnderlying(vault);
        expect(result.oneDay).toEqual(getPerformance(snapshots[0], snapshots[1]));
        expect(result.threeDay).toEqual(getPerformance(snapshots[0], snapshots[3]));
        expect(result.sevenDay).toEqual(getPerformance(snapshots[0], snapshots[4]));
        expect(result.thirtyDay).toEqual(getPerformance(snapshots[0], snapshots[4]));
      });
    });
  });

  describe('getVaultPerformance', () => {
    const vault = getVaultDefinition(TEST_CHAIN, TOKENS.BBADGER);

    describe('no rewards or harvests', () => {
      it('returns value sources from fallback methods', async () => {
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => ({ data: [] }));
        setupMapper(randomSnapshots(vault));
        const protocolFallback = jest
          .spyOn(rewardsUtils, 'getProtocolValueSources')
          .mockImplementation(async (_chain, _vault) => {
            const emissionToken = getToken(TOKENS.SUSHI);
            const rewardSource = createValueSource('Sushi Rewards', uniformPerformance(8.888));
            return [rewardsUtils.valueSourceToCachedValueSource(rewardSource, vault, tokenEmission(emissionToken))];
          });
        const result = await getVaultPerformance(TEST_CHAIN, vault);
        expect(result).toMatchSnapshot();
        expect(protocolFallback.mock.calls[1]).toMatchObject([TEST_CHAIN, vault, true]);
      });
    });

    describe('requests non standard vault performance', () => {
      it('returns value sources from fallback methods', async () => {
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => {
          throw new Error('Incompatible vault!');
        });
        setupMapper(randomSnapshots(vault));
        const protocolFallback = jest
          .spyOn(rewardsUtils, 'getProtocolValueSources')
          .mockImplementation(async (_chain, _vault) => {
            const emissionToken = getToken(TOKENS.SUSHI);
            const rewardSource = createValueSource('Sushi Rewards', uniformPerformance(8.888));
            return [rewardsUtils.valueSourceToCachedValueSource(rewardSource, vault, tokenEmission(emissionToken))];
          });
        const result = await getVaultPerformance(TEST_CHAIN, vault);
        expect(result).toMatchSnapshot();
        expect(protocolFallback.mock.calls[1]).toMatchObject([TEST_CHAIN, vault, true]);
      });
    });

    describe('requests non compatible network vault performances', () => {
      it('returns value sources from fallback methods', async () => {
        const alternateChain = new Polygon();
        const vault = getVaultDefinition(alternateChain, TOKENS.BMATIC_QUICK_USDC_WBTC);
        jest.spyOn(VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => {
          throw new Error('Incompatible vault!');
        });
        setupMapper(randomSnapshots(vault));
        const protocolFallback = jest
          .spyOn(rewardsUtils, 'getProtocolValueSources')
          .mockImplementation(async (_chain, _vault) => {
            const emissionToken = getToken(TOKENS.SUSHI);
            const rewardSource = createValueSource('Sushi Rewards', uniformPerformance(8.888));
            return [rewardsUtils.valueSourceToCachedValueSource(rewardSource, vault, tokenEmission(emissionToken))];
          });
        const result = await getVaultPerformance(alternateChain, vault);
        expect(result).toMatchSnapshot();
        expect(protocolFallback.mock.calls[1]).toMatchObject([alternateChain, vault, true]);
      });
    });

    describe('requests standard vault performance', () => {
      it('returns value sources from standard methods', async () => {
        setupSdk();
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token) => ({
          address: token,
          price: Number(token.slice(0, 6)),
        }));
        jest.spyOn(protocolsUtils, 'getVaultCachedValueSources').mockImplementation(async (vault) => {
          const underlying = createValueSource(VAULT_SOURCE, uniformPerformance(10));
          return [rewardsUtils.valueSourceToCachedValueSource(underlying, vault, SourceType.PreCompound)];
        });
        const result = await getVaultPerformance(TEST_CHAIN, vault);
        expect(result).toMatchSnapshot();
      });

      it('skips all emitted tokens with no price', async () => {
        setupSdk();
        jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token) => ({
          address: token,
          price: 0,
        }));
        const result = await getVaultPerformance(TEST_CHAIN, vault);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
