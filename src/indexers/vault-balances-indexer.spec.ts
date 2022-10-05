import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { Network, Protocol } from '@badger-dao/sdk';

import * as ddbUtils from '../aws/dynamodb.utils';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import { TOKENS } from '../config/tokens.config';
import * as balancerStrategy from '../protocols/strategies/balancer.strategy';
import * as curveStrategy from '../protocols/strategies/convex.strategy';
import * as uniswapStrategy from '../protocols/strategies/uniswap.strategy';
import { MOCK_TOKENS, MOCK_VAULT_DEFINITION, MOCK_VAULT_SNAPSHOT, TEST_ADDR } from '../test/constants';
import { mockBalance, mockQuery, randomSnapshot, setupMockChain } from '../test/mocks.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { refreshVaultBalances } from './vault-balances-indexer';

describe('vault-balances-indexer', () => {
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;

  beforeEach(() => {
    setupMockChain();
    mockQuery([randomSnapshot(MOCK_VAULT_DEFINITION)]);
    put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
    jest
      .spyOn(vaultsUtils, 'getCachedVault')
      .mockImplementation(async () => MOCK_VAULT_SNAPSHOT as CurrentVaultSnapshotModel);
  });

  describe('refreshVaultBalances', () => {
    it('should update token with balance from the vault for unsupported protocols', async () => {
      await refreshVaultBalances();
      expect(put.mock.calls[0].length).toEqual(1);
    });

    it('should update token with balance from the vault for errors encountered in supported protocols', async () => {
      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();
      const vaultDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      vaultDefinition.protocol = Protocol.Uniswap;
      jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => vaultDefinition);
      jest.spyOn(ChainVaults.prototype, 'all').mockImplementation(async () => [vaultDefinition]);
      jest.spyOn(uniswapStrategy, 'getLpTokenBalances').mockImplementation(async () => {
        throw new Error('Expected test error: getLpTokenBalances');
      });
      await refreshVaultBalances();
      expect(put.mock.calls[0].length).toEqual(1);
    });

    it('should take no action with persistence errors', async () => {
      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(ddbUtils, 'getDataMapper').mockImplementation(() => {
        throw new Error('Expected test error: getDataMapper');
      });
      await refreshVaultBalances();
      expect(put.mock.calls.length).toEqual(0);
    });

    it.each([
      [Protocol.Solidex],
      [Protocol.OxDAO],
      [Protocol.Swapr],
      [Protocol.Spookyswap],
      [Protocol.Quickswap],
      [Protocol.Sushiswap],
      [Protocol.Uniswap],
      [Protocol.Solidly],
      [Protocol.Convex],
      [Protocol.Curve],
      [Protocol.Aura],
      [Protocol.Balancer],
    ])('should return two token vault balance for %s', async (protocol) => {
      const vaultDefinition = JSON.parse(JSON.stringify(MOCK_VAULT_DEFINITION));
      vaultDefinition.protocol = protocol;
      jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => vaultDefinition);
      jest.spyOn(ChainVaults.prototype, 'all').mockImplementation(async () => [vaultDefinition]);

      const token0 = MOCK_TOKENS[TOKENS.WBTC];
      const token1 = MOCK_TOKENS[TOKENS.BADGER];
      let cachedVaultBalance: VaultTokenBalance;
      if (protocol !== Protocol.Aura && protocol !== Protocol.Balancer) {
        cachedVaultBalance = Object.assign(new VaultTokenBalance(), {
          id: TEST_ADDR,
          vault: TEST_ADDR,
          chain: Network.Ethereum,
          tokenBalances: [mockBalance(token0, 1), mockBalance(token1, 5000)],
        });
        jest.spyOn(uniswapStrategy, 'getLpTokenBalances').mockImplementation(async () => cachedVaultBalance);
        jest.spyOn(curveStrategy, 'getCurveVaultTokenBalance').mockImplementation(async () => cachedVaultBalance);
      } else {
        const token2 = MOCK_TOKENS[TOKENS.GRAVI_AURA];
        cachedVaultBalance = Object.assign(new VaultTokenBalance(), {
          id: TEST_ADDR,
          vault: TEST_ADDR,
          chain: Network.Ethereum,
          tokenBalances: [mockBalance(token0, 1), mockBalance(token1, 5000), mockBalance(token2, 10000)],
        });
        jest.spyOn(balancerStrategy, 'getBalancerVaultTokenBalance').mockImplementation(async () => cachedVaultBalance);
      }

      await refreshVaultBalances();
      const inputs = put.mock.calls[0];
      expect(inputs.length).toEqual(1);
      expect(inputs[0]).toMatchObject(cachedVaultBalance);
    });
  });
});
