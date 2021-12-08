import { Protocol, Vault, VaultState, VaultType } from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Ethereum } from '../chains/config/eth.config';
import { BouncerType } from '../rewards/enums/bouncer-type.enum';
import { randomPerformance, randomSett, randomSnapshot, randomSnapshots, setupMapper } from '../test/tests.utils';
import { getToken } from '../tokens/tokens.utils';
import { defaultVault, getCachedSett, getPerformance, getVaultDefinition, getSettSnapshots } from './vaults.utils';

describe('setts.utils', () => {
  describe('VaultState', () => {
    it('returns a sett default fields', () => {
      const settDefinition = randomSett();
      const depositToken = getToken(settDefinition.depositToken);
      const settToken = getToken(settDefinition.settToken);
      const expected: Vault = {
        asset: depositToken.symbol,
        settAsset: settToken.symbol,
        newVault: settDefinition.newVault ?? false,
        state: settDefinition.state ?? VaultState.Open,
        apr: 0,
        balance: 0,
        boost: {
          enabled: false,
          weight: 0,
        },
        bouncer: settDefinition.bouncer ?? BouncerType.None,
        name: settDefinition.name,
        protocol: Protocol.Badger,
        pricePerFullShare: 1,
        sources: [],
        tokens: [],
        underlyingToken: settDefinition.depositToken,
        value: 0,
        settToken: settDefinition.settToken,
        strategy: {
          address: ethers.constants.AddressZero,
          withdrawFee: 50,
          performanceFee: 20,
          strategistFee: 10,
        },
        type: VaultType.Standard,
      };
      const actual = defaultVault(settDefinition);
      expect(actual).toMatchObject(expected);
    });
  });

  describe('getCachedSett', () => {
    describe('no cached sett exists', () => {
      it('returns the default sett', async () => {
        setupMapper([]);
        const settDefinition = randomSett();
        const cached = await getCachedSett(settDefinition);
        expect(cached).toMatchObject(defaultVault(settDefinition));
      });
    });

    describe('a cached sett exists', () => {
      it('returns the cached sett', async () => {
        const sett = randomSett();
        const snapshot = randomSnapshot(sett);
        setupMapper([snapshot]);
        const cached = await getCachedSett(sett);
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
        const sett = randomSett();
        const cached = await getSettSnapshots(sett);
        expect(cached).toMatchObject([]);
      });
    });

    describe('many sett snapshots exists', () => {
      it('returns the sett snaphots', async () => {
        const sett = randomSett();
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
        const actual = getVaultDefinition(eth, expected.settToken);
        expect(actual).toMatchObject(expected);
      });
    });

    describe('for an existing sett on a different chain', () => {
      it('throws a not found error', () => {
        const eth = new Ethereum();
        const expected = eth.setts[Math.floor(Math.random() * eth.setts.length)];
        expect(() => getVaultDefinition(new BinanceSmartChain(), expected.settToken)).toThrow(NotFound);
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
});
