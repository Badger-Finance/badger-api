import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { loadChains } from '../chains/chain';
import { BscStrategy } from '../chains/strategies/bsc.strategy';
import { EthStrategy } from '../chains/strategies/eth.strategy';
import { SettQuery } from '../graphql/generated/badger';
import * as priceUtils from '../prices/prices.utils';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import * as settUtils from '../setts/setts.utils';
import { refreshSettSnapshots } from './sett-snapshots-indexer';

describe('refreshSettSnapshots', () => {
  const supportedAddresses = loadChains()
    .flatMap((s) => s.setts)
    .map((settDefinition) => settDefinition.settToken)
    .sort();

  let getSettMock: jest.SpyInstance<
    Promise<SettQuery>,
    [graphUrl: string, contract: string, block?: number | undefined]
  >;
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [items: PutParameters<StringToAnyObjectMap>]>;

  beforeEach(async () => {
    getSettMock = jest.spyOn(settUtils, 'getSett').mockImplementation(async (_graphUrl: string, _contract: string) => ({
      sett: {
        id: 'sett_123',
        balance: 0,
        token: {
          id: '0xdead',
          decimals: 18,
        },
        netDeposit: 0,
        netShareDeposit: 0,
        pricePerFullShare: 1,
        totalSupply: 10,
      },
    }));

    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    const mockTokenPrice = { name: 'mock', usd: 10, eth: 0, address: '0xbeef' };
    jest.spyOn(BscStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);
    jest.spyOn(EthStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);

    const mockTokenPriceSnapshot = { name: 'mock', usd: 10, eth: 0, address: '0xbeef', updatedAt: Date.now() };
    jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (_address: string) => mockTokenPriceSnapshot);

    await refreshSettSnapshots();
  });

  it('fetches Setts for all chains', async () => {
    const requestedAddresses = getSettMock.mock.calls.map((calls) => calls[1]);
    expect(requestedAddresses.sort()).toEqual(supportedAddresses);
  });

  it('saves Setts in Dynamo', () => {
    const requestedAddresses = [];
    // Verify each saved object.
    for (const inputs of put.mock.calls) {
      // force convert input as jest overload mock causes issues
      const snapshot = inputs[0] as unknown as CachedSettSnapshot;
      expect(snapshot).toMatchObject({
        address: expect.any(String),
        balance: expect.any(Number),
        supply: expect.any(Number),
        ratio: expect.any(Number),
        settValue: expect.any(Number),
      });
      requestedAddresses.push(snapshot.address);
    }
    // Verify addresses match supported setts.
    expect(requestedAddresses.sort()).toEqual(supportedAddresses);
  });
});
