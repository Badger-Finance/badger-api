import {
  BadgerGraph,
  EmissionControl,
  EmissionControl__factory,
  RegistryVault,
  Strategy__factory,
  VaultsService,
  VaultV15,
  VaultV15__factory,
} from '@badger-dao/sdk';
import { Strategy } from '@badger-dao/sdk/lib/contracts/Strategy';
import * as gqlGenT from '@badger-dao/sdk/lib/graphql/generated/badger';
import graphVaults from '@badger-dao/sdk-mocks/generated/ethereum/graph/loadSetts.json';
import vaultStrategy from '@badger-dao/sdk-mocks/generated/ethereum/vaults/getVaultStrategy.json';
import registryVaults from '@badger-dao/sdk-mocks/generated/ethereum/vaults/loadVaults.json';
import { BigNumber } from 'ethers';

import { TestEthereum } from '../chains/config/test.config';
import { MOCK_VAULT, MOCK_VAULT_DEFINITION, TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { mockContract } from '../test/mocks.utils/contracts/mock.contract.base';
import * as apiVaults from '../vaults/vaults.service';
import { constructVaultDefinition, vaultToSnapshot } from './indexer.utils';

describe('indexer.utils', () => {
  async function setupBaseUtilFixture() {
    jest.spyOn(Date, 'now').mockImplementation(() => TEST_CURRENT_TIMESTAMP);

    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();

    const strategyMock = mockContract<Strategy>(Strategy__factory);
    const vaultV15Mock = mockContract<VaultV15>(VaultV15__factory);
    const emissionControl = mockContract<EmissionControl>(EmissionControl__factory);

    jest.spyOn(strategyMock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
    jest.spyOn(strategyMock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
    jest.spyOn(strategyMock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));

    jest.spyOn(vaultV15Mock, 'withdrawalFee').mockImplementation(async () => BigNumber.from(1));
    jest.spyOn(vaultV15Mock, 'performanceFeeGovernance').mockImplementation(async () => BigNumber.from(2));
    jest.spyOn(vaultV15Mock, 'performanceFeeStrategist').mockImplementation(async () => BigNumber.from(3));
    jest.spyOn(vaultV15Mock, 'managementFee').mockImplementation(async () => BigNumber.from(4));

    jest.spyOn(emissionControl, 'boostedEmissionRate').mockImplementation(async () => BigNumber.from(1));

    const chain = setupMockChain();

    jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async function ({ address }) {
      return <RegistryVault>registryVaults.find((v) => v.address === address);
    });
    jest.spyOn(VaultsService.prototype, 'getVaultStrategy').mockImplementation(async () => vaultStrategy);

    jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async ({ id }) => {
      const graphVault = graphVaults.setts.find((v) => v.id === id);

      if (!graphVault) return { sett: null };

      return { sett: <gqlGenT.SettQuery['sett']>graphVault, __typename: 'Query' };
    });

    jest.spyOn(apiVaults.VaultsService, 'loadVault').mockImplementation(async () => MOCK_VAULT);

    return { chain, strategyMock, vaultV15Mock };
  }

  describe('vaultToSnapshot', () => {
    let testChain: TestEthereum;

    beforeEach(async () => {
      const { chain } = await setupBaseUtilFixture();

      testChain = chain;
    });

    it('should return valid snapshot of the vault', async () => {
      const snapshot = await vaultToSnapshot(testChain, MOCK_VAULT_DEFINITION);

      // small lol here
      expect(snapshot).toMatchSnapshot();
    });
  });

  describe('constructVaultsDefinition', () => {
    let testChain: TestEthereum;

    beforeEach(async () => {
      const { chain } = await setupBaseUtilFixture();

      testChain = chain;
    });

    it('should construct vault definition', async () => {
      expect(await constructVaultDefinition(testChain, <RegistryVault>registryVaults[0])).toMatchSnapshot();
    });

    it('should return null if no data on the Graph', async () => {
      jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async () => ({ sett: null }));

      expect(await constructVaultDefinition(testChain, <RegistryVault>registryVaults[1])).toBeNull();
    });
  });
});
