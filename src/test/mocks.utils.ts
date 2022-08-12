import { providers } from '@0xsequence/multicall';
import BadgerSDK, { RegistryService, RewardsService } from '@badger-dao/sdk';
import { mock } from 'jest-mock-extended';
import { TestEthereum } from '../chains/config/teth.config';
import { ChainVaults } from '../chains/vaults/chain.vaults';
import { MOCK_VAULT_DEFINITION, TEST_ADDR, TEST_CURRENT_BLOCK } from './constants';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';

export function setupMockChain() {
  jest.spyOn(ChainVaults.prototype, 'getVault').mockImplementation(async (_) => MOCK_VAULT_DEFINITION);
  jest.spyOn(ChainVaults.prototype, 'all').mockImplementation(async () => [MOCK_VAULT_DEFINITION]);

  const mockSigner = mock<JsonRpcSigner>();
  mockSigner.getAddress.calledWith().mockImplementation(async () => TEST_ADDR);
  const mockProvider = mock<JsonRpcProvider>();
  mockProvider.getSigner.calledWith().mockImplementation(() => mockSigner);
  mockProvider.getBlockNumber.calledWith().mockImplementation(async () => TEST_CURRENT_BLOCK);

  const mockMulticall = mock<providers.MulticallProvider>();
  jest.spyOn(BadgerSDK.prototype, 'getMulticallProvider').mockImplementation((_p) => mockMulticall);
  jest.spyOn(RegistryService.prototype, 'ready').mockImplementation();
  jest.spyOn(RewardsService.prototype, 'ready').mockImplementation();

  return new TestEthereum(mockProvider);
}
