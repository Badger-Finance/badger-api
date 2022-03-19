import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { loadChains } from '../chains/chain';
import * as priceUtils from '../prices/prices.utils';
import * as vaultUtils from '../vaults/vaults.utils';
import { refreshVaultSnapshots } from './vault-snapshots-indexer';
import { BigNumber, ethers } from 'ethers';
import { randomVault, setupMapper, TEST_ADDR } from '../test/tests.utils';
import BadgerSDK, {
  VaultState,
  VaultVersion,
  RegistryVault,
  LoadVaultOptions,
  VaultsService,
  VaultSnapshot,
} from '@badger-dao/sdk';
import * as tokenUtils from '../tokens/tokens.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import { TOKENS } from '../config/tokens.config';

describe('refreshSettSnapshots', () => {
  const supportedAddresses = loadChains()
    .flatMap((s) => s.vaults)
    .map((settDefinition) => settDefinition.vaultToken)
    .sort();

  let vaultsMock: jest.SpyInstance<Promise<RegistryVault>, [opts: LoadVaultOptions]>;
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [items: PutParameters<StringToAnyObjectMap>]>;

  beforeEach(async () => {
    jest.spyOn(vaultUtils, 'getStrategyInfo').mockImplementation(async (_chain, _sett) => ({
      address: ethers.constants.AddressZero,
      withdrawFee: 50,
      performanceFee: 20,
      strategistFee: 10,
    }));
    vaultsMock = jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async ({ address }) => ({
      name: 'Test Vault',
      address,
      symbol: 'TEST',
      decimals: 18,
      balance: 1,
      totalSupply: 2,
      available: 0.5,
      pricePerFullShare: 1.003,
      token: {
        address: TEST_ADDR,
        decimals: 18,
        symbol: 'TEST',
        name: 'TEST Token',
      },
      state: VaultState.Open,
      version: VaultVersion.v1,
    }));
    jest.spyOn(vaultUtils, 'getBoostWeight').mockImplementation(async (_chain, _sett) => BigNumber.from(5100));

    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    jest.spyOn(BadgerSDK.prototype, 'ready').mockImplementation();
    jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (address: string) => {
      return {
        address,
        price: 10,
      };
    });
    jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
      return fullTokenMockMap[tokenAddr] || fullTokenMockMap[TOKENS.BADGER];
    });

    setupMapper([randomVault()]);
    await refreshVaultSnapshots();
  });

  it('fetches vaults for all chains', async () => {
    const requestedAddresses = vaultsMock.mock.calls.map((calls) => calls[0].address);
    expect(requestedAddresses.sort()).toEqual(supportedAddresses);
  });

  it('saves vaults in dynamo db', () => {
    const requestedAddresses = [];
    // Verify each saved object.
    for (const input of put.mock.calls) {
      // force convert input as jest overload mock causes issues
      const snapshot = input[0] as unknown as VaultSnapshot;
      expect(snapshot).toMatchObject({
        address: expect.any(String),
        balance: expect.any(Number),
        totalSupply: expect.any(Number),
        pricePerFullShare: expect.any(Number),
        value: expect.any(Number),
        strategy: {
          address: expect.any(String),
          withdrawFee: expect.any(Number),
          performanceFee: expect.any(Number),
          strategistFee: expect.any(Number),
        },
        block: expect.any(Number),
        boostWeight: expect.any(Number),
        timestamp: expect.any(Number),
        available: expect.any(Number),
      });
      requestedAddresses.push(snapshot.address);
    }
    // Verify addresses match supported setts.
    expect(requestedAddresses.sort()).toEqual(supportedAddresses);
  });
});
