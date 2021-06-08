import { NotFound } from '@tsed/exceptions';
import { loadChains } from '../chains/chain';
import { BinanceSmartChain } from '../chains/config/bsc.config';
import { Ethereum } from '../chains/config/eth.config';
import { ONE_DAY_MS, SAMPLE_DAYS } from '../config/constants';
import { randomValue, setupMapper } from '../test/tests.utils';
import { getToken } from '../tokens/tokens.utils';
import { CachedSettSnapshot } from './interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from './interfaces/sett-definition.interface';
import { SettSnapshot } from './interfaces/sett-snapshot.interface';
import {
  defaultSett,
  getCachedSett,
  getPerformance,
  getSettDefinition,
  getSettSnapshots,
  getSnapshot,
} from './setts.utils';

describe('setts.utils', () => {
  const randomSett = (): SettDefinition => {
    const definitions = loadChains().flatMap((chain) => chain.setts);
    return definitions[Math.floor(Math.random() * definitions.length)];
  };

  const randomSnapshot = (settDefinition?: SettDefinition): CachedSettSnapshot => {
    const sett = settDefinition || randomSett();
    return Object.assign(new CachedSettSnapshot(), {
      address: sett.settToken,
      balance: randomValue(),
      ratio: 1,
      settValue: randomValue(),
      supply: randomValue(),
      updatedAt: Date.now(),
    });
  };

  const randomSnapshots = (settDefinition?: SettDefinition, count?: number): SettSnapshot[] => {
    const snapshots: SettSnapshot[] = [];
    const snapshotCount = count || SAMPLE_DAYS;
    const sett = settDefinition || randomSett();
    for (let i = 0; i < snapshotCount; i++) {
      snapshots.push(
        Object.assign(new SettSnapshot(), {
          asset: sett.name,
          height: 0,
          timestamp: Date.now(),
          balance: randomValue(),
          supply: randomValue(),
          ratio: 1,
          value: randomValue(),
        }),
      );
    }
    return snapshots;
  };

  const randomPerformance = (): [SettSnapshot, SettSnapshot] => {
    const [current, initial] = randomSnapshots(randomSett(), 2);
    initial.timestamp = current.timestamp - ONE_DAY_MS;
    return [current, initial];
  };

  describe('defaultSett', () => {
    it('returns a sett default fields', () => {
      const settDefinition = randomSett();
      const settToken = getToken(settDefinition.settToken);
      const expected = {
        asset: settToken.symbol,
        apr: 0,
        balance: 0,
        boostable: false,
        experimental: !!settDefinition.experimental,
        hasBouncer: !!settDefinition.hasBouncer,
        name: settDefinition.name,
        ppfs: 1,
        sources: [],
        tokens: [],
        underlyingToken: settDefinition.depositToken,
        value: 0,
        vaultToken: settDefinition.settToken,
      };
      const actual = defaultSett(settDefinition);
      expect(actual).toMatchObject(expected);
    });
  });

  describe('getCachedSett', () => {
    describe('no cached sett exists', () => {
      it('returns the default sett', async () => {
        setupMapper([]);
        const settDefinition = randomSett();
        const cached = await getCachedSett(settDefinition);
        expect(cached).toMatchObject(defaultSett(settDefinition));
      });
    });

    describe('a cached sett exists', () => {
      it('returns the cached sett', async () => {
        const sett = randomSett();
        const snapshot = randomSnapshot(sett);
        setupMapper([snapshot]);
        const cached = await getCachedSett(sett);
        const expected = defaultSett(sett);
        expected.ppfs = snapshot.balance / snapshot.supply;
        expected.balance = snapshot.balance;
        expected.value = snapshot.settValue;
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

  describe('getSnapshot', () => {
    describe('request a valid index', () => {
      it('returns the requested index', () => {
        const sett = randomSett();
        const snapshots = randomSnapshots(sett);
        const index = Math.floor(Math.random() * snapshots.length);
        const expected = snapshots[index];
        const actual = getSnapshot(snapshots, index);
        expect(actual).toMatchObject(expected);
      });
    });

    describe('request an out of range index', () => {
      it('returns the final index', () => {
        const sett = randomSett();
        const snapshots = randomSnapshots(sett);
        const expected = snapshots[snapshots.length - 1];
        const actual = getSnapshot(snapshots, snapshots.length);
        expect(actual).toMatchObject(expected);
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

  describe('getSettDefinition', () => {
    describe('for an existing sett', () => {
      it('returns the expected sett definition', () => {
        const eth = new Ethereum();
        const expected = eth.setts[Math.floor(Math.random() * eth.setts.length)];
        const actual = getSettDefinition(eth, expected.settToken);
        expect(actual).toMatchObject(expected);
      });
    });

    describe('for an existing sett on a different chain', () => {
      it('throws a not found error', () => {
        const eth = new Ethereum();
        const expected = eth.setts[Math.floor(Math.random() * eth.setts.length)];
        expect(() => getSettDefinition(new BinanceSmartChain(), expected.settToken)).toThrow(NotFound);
      });
    });

    describe('for an non existing sett', () => {
      it('throws a not found error', () => {
        const eth = new Ethereum();
        const expected = eth.setts[Math.floor(Math.random() * eth.setts.length)];
        expect(() => getSettDefinition(eth, expected.depositToken)).toThrow(NotFound);
      });
    });
  });
});
