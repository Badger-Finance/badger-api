import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { loadChains } from '../chains/chain';
import { ArbitrumStrategy } from '../chains/strategies/arbitrum.strategy';
import { BscStrategy } from '../chains/strategies/bsc.strategy';
import { EthStrategy } from '../chains/strategies/eth.strategy';
import { MaticStrategy } from '../chains/strategies/matic.strategy';
import { xDaiStrategy } from '../chains/strategies/xdai.strategy';
import { SettQuery } from '../graphql/generated/badger';
import * as priceUtils from '../prices/prices.utils';
import { CachedSettSnapshot } from '../vaults/interfaces/cached-sett-snapshot.interface';
import * as vaultUtils from '../vaults/vaults.utils';
import { refreshSettSnapshots } from './sett-snapshots-indexer';
import { BigNumber, ethers } from 'ethers';
import { BaseStrategy } from '../chains/strategies/base.strategy';
import { TOKENS } from '../config/tokens.config';

describe('refreshSettSnapshots', () => {
  const supportedAddresses = loadChains()
    .flatMap((s) => s.setts)
    .map((settDefinition) => settDefinition.vaultToken)
    .sort();

  let getSettMock: jest.SpyInstance<
    Promise<SettQuery>,
    [graphUrl: string, contract: string, block?: number | undefined]
  >;
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [items: PutParameters<StringToAnyObjectMap>]>;

  beforeEach(async () => {
    getSettMock = jest
      .spyOn(vaultUtils, 'getVault')
      .mockImplementation(async (_graphUrl: string, _contract: string) => ({
        sett: {
          id: TOKENS.BBADGER,
          available: 1,
          balance: 0,
          token: {
            id: TOKENS.BADGER,
            decimals: 18,
          },
          netDeposit: 0,
          netShareDeposit: 0,
          pricePerFullShare: 1,
          totalSupply: 10,
        },
      }));
    jest.spyOn(vaultUtils, 'getCachedVault').mockImplementation(async (sett) => vaultUtils.defaultVault(sett));
    jest.spyOn(vaultUtils, 'getStrategyInfo').mockImplementation(async (_chain, _sett) => ({
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10,
    }));
    jest.spyOn(vaultUtils, 'getBoostWeight').mockImplementation(async (_chain, _sett) => BigNumber.from(5100));
    jest
      .spyOn(vaultUtils, 'getPricePerShare')
      .mockImplementation(async (_chain, ppfs, _sett, _block) => Number(ethers.utils.formatEther(ppfs)));

    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    const mockTokenPrice = { name: 'mock', usd: 10, eth: 0, address: '0xbeef' };
    jest.spyOn(BaseStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);
    jest.spyOn(ArbitrumStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);
    jest.spyOn(BscStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);
    jest.spyOn(EthStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);
    jest.spyOn(MaticStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);
    jest.spyOn(xDaiStrategy.prototype, 'getPrice').mockImplementation(async (_address: string) => mockTokenPrice);

    const mockTokenPriceSnapshot = { name: 'mock', usd: 10, eth: 0.0001, address: '0xbeef', updatedAt: Date.now() };
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
    for (const input of put.mock.calls) {
      // force convert input as jest overload mock causes issues
      const snapshot = input[0] as unknown as CachedSettSnapshot;
      expect(snapshot).toMatchObject({
        address: expect.any(String),
        balance: expect.any(Number),
        supply: expect.any(Number),
        ratio: expect.any(Number),
        settValue: expect.any(Number),
        strategy: {
          address: expect.any(String),
          withdrawFee: expect.any(Number),
          performanceFee: expect.any(Number),
          strategistFee: expect.any(Number),
        },
      });
      requestedAddresses.push(snapshot.address);
    }
    // Verify addresses match supported setts.
    expect(requestedAddresses.sort()).toEqual(supportedAddresses);
  });
});
