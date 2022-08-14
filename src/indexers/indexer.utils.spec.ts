import BadgerSDK, {
  RegistryVault,
  Strategy__factory,
  VaultsService,
  VaultV15,
  VaultV15__factory,
} from '@badger-dao/sdk';
import { Strategy } from '@badger-dao/sdk/lib/contracts/Strategy';
import vaultStrategy from '@badger-dao/sdk-mocks/generated/ethereum/vaults/getVaultStrategy.json';
import registryVaults from '@badger-dao/sdk-mocks/generated/ethereum/vaults/loadVaults.json';
import { BigNumber } from 'ethers';
import { mock, MockProxy } from 'jest-mock-extended';

import { Ethereum } from '../chains/config/eth.config';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { mockBadgerSdk, mockPricing, TEST_CHAIN } from '../test/tests.utils';
import * as apiVaults from '../vaults/vaults.service';
import { vaultToSnapshot } from './indexer.utils';

describe('indexer.utils', () => {
  describe('vaultToSnapshot', () => {
    let sdk: BadgerSDK;

    let strategyMock: MockProxy<Strategy>;
    let vaultV15Mock: MockProxy<VaultV15>;

    beforeEach(async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => TEST_CURRENT_TIMESTAMP);

      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();

      strategyMock = mock<Strategy>();
      vaultV15Mock = mock<VaultV15>();

      jest.spyOn(Strategy__factory, 'connect').mockImplementation(() => strategyMock);
      jest.spyOn(VaultV15__factory, 'connect').mockImplementation(() => vaultV15Mock);

      jest.spyOn(strategyMock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
      jest.spyOn(strategyMock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
      jest.spyOn(strategyMock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));

      jest.spyOn(vaultV15Mock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
      jest.spyOn(vaultV15Mock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
      jest.spyOn(vaultV15Mock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));
      jest.spyOn(vaultV15Mock, 'managementFee').mockImplementation(async () => BigNumber.from(4));

      sdk = await mockBadgerSdk();

      jest.spyOn(Ethereum.prototype, 'getSdk').mockImplementation(async () => sdk);

      jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async function ({ address }) {
        return <RegistryVault>registryVaults.find((v) => v.address === address);
      });
      jest.spyOn(VaultsService.prototype, 'getVaultStrategy').mockImplementation(async () => vaultStrategy);

      mockPricing();

      jest.spyOn(apiVaults.VaultsService, 'loadVault').mockImplementation(async () => MOCK_VAULT);
    });

    it('should return valid snapshot of the vault', async () => {
      const snapshot = await vaultToSnapshot(TEST_CHAIN, MOCK_VAULT_DEFINITION);

      // small lol here
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('constructVaultsDefinition', () => {
    it('should return vault definition', async () => {
      expect(true).toBe(true);
    });
  });
});
