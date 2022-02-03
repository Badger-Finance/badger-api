import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { loadChains } from '../chains/chain';
import * as priceUtils from '../prices/prices.utils';
import { CachedSettSnapshot } from '../vaults/interfaces/cached-sett-snapshot.interface';
import * as vaultUtils from '../vaults/vaults.utils';
import { refreshSettSnapshots } from './sett-snapshots-indexer';
import { BigNumber, ethers } from 'ethers';
import { TEST_ADDR } from '../test/tests.utils';
// TODO: better export this from the sdk
import { VaultsService } from '@badger-dao/sdk/lib/vaults/vaults.service';
import { getToken } from '../tokens/tokens.utils';
import { VaultToken } from '@badger-dao/sdk/lib/vaults/interfaces';

describe('refreshSettSnapshots', () => {
  const supportedAddresses = loadChains()
    .flatMap((s) => s.setts)
    .map((settDefinition) => settDefinition.vaultToken)
    .sort();

  let vaultsMock: jest.SpyInstance<Promise<VaultToken>, [address: string, update?: boolean]>;
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [items: PutParameters<StringToAnyObjectMap>]>;

  beforeEach(async () => {
    jest.spyOn(vaultUtils, 'getStrategyInfo').mockImplementation(async (_chain, _sett) => ({
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10,
    }));
    vaultsMock = jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async (address) => ({
      name: 'Test Vault',
      address,
      symbol: 'TEST',
      decimals: 18,
      balance: 1,
      totalSupply: 2,
      available: 0.5,
      pricePerFullShare: 1.003,
      token: TEST_ADDR,
    }));
    jest.spyOn(vaultUtils, 'getBoostWeight').mockImplementation(async (_chain, _sett) => BigNumber.from(5100));

    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (address: string) => {
      const token = getToken(address);
      return {
        name: token.name,
        address,
        usd: 10,
        eth: 0.0005,
      };
    });

    await refreshSettSnapshots();
  });

  it('fetches Setts for all chains', async () => {
    const requestedAddresses = vaultsMock.mock.calls.map((calls) => calls[0]);
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
