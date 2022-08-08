import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { VaultSnapshot } from '@badger-dao/sdk';

import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import * as chartUtils from '../charts/charts.utils';
import { MOCK_VAULT_DEFINITION, MOCK_VAULT_SNAPSHOT } from '../test/constants';
import { mockChainVaults } from '../test/tests.utils';
import * as indexerUtils from './indexer.utils';
import { refreshVaultSnapshots } from './vault-snapshots-indexer';

describe('refreshVaultSnapshots', () => {
  const supportedAddresses = Array.from({ length: SUPPORTED_CHAINS.length }, () => MOCK_VAULT_DEFINITION.address);

  let vaultToSnapshot: jest.SpyInstance<Promise<VaultSnapshot>, [chain: Chain, vault: VaultDefinitionModel]>;
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [items: PutParameters<StringToAnyObjectMap>]>;

  beforeEach(async () => {
    mockChainVaults();

    jest.spyOn(chartUtils, 'updateSnapshots').mockImplementation();
    const baseSnapshot: VaultSnapshot = JSON.parse(JSON.stringify(MOCK_VAULT_SNAPSHOT));
    baseSnapshot.address = MOCK_VAULT_DEFINITION.address;
    vaultToSnapshot = jest.spyOn(indexerUtils, 'vaultToSnapshot').mockImplementation(async (_c, _v) => baseSnapshot);
    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();

    await refreshVaultSnapshots();
  });

  it('fetches vaults for all chains', async () => {
    const requestedAddresses = vaultToSnapshot.mock.calls.map((calls) => calls[1].address);
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
