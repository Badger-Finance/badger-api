import BadgerSDK, { Network, RegistryService, RewardsService } from '@badger-dao/sdk';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { mock } from 'jest-mock-extended';

import { TEST_ADDR, TEST_CURRENT_BLOCK, TEST_DEFAULT_GAS_PRICE } from '../constants';

export async function mockBadgerSdk(
  // in case u want to skip one param
  {
    addr = TEST_ADDR,
    network = Network.Ethereum,
    currBlock = TEST_CURRENT_BLOCK,
  }: {
    // type description
    addr?: string;
    network?: Network;
    currBlock?: number;
  } = {
    // in case u want to skip all params
    addr: TEST_ADDR,
    network: Network.Ethereum,
    currBlock: TEST_CURRENT_BLOCK,
  },
): Promise<{ sdk: BadgerSDK; provider: JsonRpcProvider }> {
  const mockSigner = mock<JsonRpcSigner>();
  mockSigner.getAddress.calledWith().mockImplementation(async () => addr);
  const mockProvider = mock<JsonRpcProvider>();
  jest.spyOn(mockProvider, 'getSigner').mockImplementation(() => mockSigner);
  jest.spyOn(mockProvider, 'getBlockNumber').mockImplementation(async () => currBlock);
  jest.spyOn(mockProvider, 'getGasPrice').mockImplementation(async () => BigNumber.from(TEST_DEFAULT_GAS_PRICE));

  // Services that will force contracts connection in sdk constructor
  jest.spyOn(RegistryService.prototype, 'ready').mockImplementation();
  jest.spyOn(RewardsService.prototype, 'ready').mockImplementation();

  return {
    sdk: new BadgerSDK({ provider: mockProvider, network }),
    provider: mockProvider,
  };
}
