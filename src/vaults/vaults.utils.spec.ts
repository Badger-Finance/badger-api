import { Protocol, Vault, VaultState, VaultType } from '@badger-dao/sdk';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { randomPerformance, randomVault, randomSnapshot, randomSnapshots, setupMapper } from '../test/tests.utils';
import { getToken } from '../tokens/tokens.utils';
import {
  defaultVault,
  getCachedVault,
  getPerformance,
  getVaultDefinition,
  getSettSnapshots,
  getVaultTokenPrice,
} from './vaults.utils';

describe('vaults.utils', () => {
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
        const settDefinition = randomVault();
        const cached = await getCachedVault(settDefinition);
        expect(cached).toMatchObject(defaultVault(settDefinition));
      });
    });

    describe('a cached vault exists', () => {
      it('returns the vault sett', async () => {
        const sett = randomVault();
        const snapshot = randomSnapshot(sett);
        setupMapper([snapshot]);
        const cached = await getCachedVault(sett);
        const expected = defaultVault(sett);
        expected.pricePerFullShare = snapshot.balance / snapshot.supply;
        expected.balance = snapshot.balance;
        expected.value = snapshot.settValue;
        expected.boost = {
          enabled: snapshot.boostWeight > 0,
          weight: snapshot.boostWeight,
        };
        expect(cached).toMatchObject(expected);
      });
    });
  });

  describe('getSettSnapshots', () => {
    describe('no sett snapshots exists', () => {
      it('returns the default sett', async () => {
        setupMapper([]);
        const sett = randomVault();
        const cached = await getSettSnapshots(sett);
        expect(cached).toMatchObject([]);
      });
    });

    describe('many sett snapshots exists', () => {
      it('returns the sett snaphots', async () => {
        const sett = randomVault();
        const snapshots = randomSnapshots(sett);
        setupMapper(snapshots);
        const cached = await getSettSnapshots(sett);
        expect(cached).toMatchObject(snapshots);
      });
    });
  });

  describe('getPerformance', () => {
    it('correctly evaluate no change', () => {
      const [current, initial] = randomPerformance();
      const performance = getPerformance(current, initial);
      expect(performance).toEqual(0);
    });

    it('correctly evaluate increase', () => {
      const [current, initial] = randomPerformance();
      current.ratio = 1.01;
      const performance = getPerformance(current, initial);
      const expected = 365;
      expect(performance.toFixed(3)).toEqual(expected.toFixed(3));
    });

    it('correctly evaluate decrease', () => {
      const [current, initial] = randomPerformance();
      current.ratio = 1 - 0.03 / 365;
      const performance = getPerformance(current, initial);
      const expected = -3;
      expect(performance.toFixed(3)).toEqual(expected.toFixed(3));
    });
  });

  describe('getVaultDefinition', () => {
    describe('for an existing sett', () => {
      it('returns the expected sett definition', () => {
        const eth = new Ethereum();
        const expected = eth.setts[Math.floor(Math.random() * eth.setts.length)];
        const actual = getVaultDefinition(eth, expected.vaultToken);
        expect(actual).toMatchObject(expected);
      });
    });

    describe('for an existing sett on a different chain', () => {
      it('throws a not found error', () => {
        const eth = new Ethereum();
        const expected = eth.setts[Math.floor(Math.random() * eth.setts.length)];
        expect(() => getVaultDefinition(new BinanceSmartChain(), expected.vaultToken)).toThrow(NotFound);
      });
    });

    describe('for an non existing sett', () => {
      it('throws a not found error', () => {
        const eth = new Ethereum();
        const expected = eth.setts[Math.floor(Math.random() * eth.setts.length)];
        expect(() => getVaultDefinition(eth, expected.depositToken)).toThrow(NotFound);
      });
    });
  });

  describe('getVaultTokenPrice', () => {
    describe('look up non vault token price', () => {
      it('throws a bad request error', async () => {
        await expect(getVaultTokenPrice(TOKENS.BADGER)).rejects.toThrow(BadRequest);
      });
    });
  });
});
