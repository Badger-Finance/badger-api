import { DataMapper, PutParameters, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import {
  BadgerGraph,
  BadgerSDK,
  RegistryService,
  RegistryVault,
  VaultRegistryEntry,
  VaultsService,
} from '@badger-dao/sdk';
import * as gqlGenT from '@badger-dao/sdk/lib/graphql/generated/badger';
import graphVaults from '@badger-dao/sdk-mocks/generated/ethereum/graph/loadSetts.json';
import developmentVaults from '@badger-dao/sdk-mocks/generated/ethereum/registry/getDevelopmentVaults.json';
import registryVaults from '@badger-dao/sdk-mocks/generated/ethereum/registry/getProductionVaults.json';
import mockVaults from '@badger-dao/sdk-mocks/generated/ethereum/vaults/loadVaults.json';

import VaultsCompoundMock from '../../seed/vault-definition.json';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { getSupportedChains } from '../chains/chains.utils';
import { TEST_CURRENT_TIMESTAMP } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { captureVaultData } from './vault-definition-indexer';

describe('vault-definition-indexer', () => {
  describe('captureVaultData', () => {
    let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [items: PutParameters<StringToAnyObjectMap>]>;

    beforeEach(async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => TEST_CURRENT_TIMESTAMP);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(RegistryService.prototype, 'hasRegistry').mockImplementation(() => true);

      mockQuery([]);

      jest.spyOn(RegistryService.prototype, 'getProductionVaults').mockImplementation(async function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ((<BadgerSDK>this).config.network != 'ethereum') {
          return [];
        }
        return <VaultRegistryEntry[]>registryVaults;
      });
      jest.spyOn(RegistryService.prototype, 'getDevelopmentVaults').mockImplementation(async function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ((<BadgerSDK>this).config.network != 'ethereum') {
          return [];
        }
        return <VaultRegistryEntry[]>developmentVaults;
      });
      jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async ({ id }) => {
        const graphVault = graphVaults.setts.find((v) => v.id === id);

        if (!graphVault) {
          return { sett: null };
        }

        return { sett: <gqlGenT.SettQuery['sett']>graphVault, __typename: 'Query' };
      });
      jest.spyOn(VaultsService.prototype, 'loadVault').mockImplementation(async (v) => {
        const vault = mockVaults.find((vault) => vault.address === v.address);
        if (vault) {
          return <RegistryVault>vault;
        }
        return <RegistryVault>mockVaults[0];
      });

      await setupMockChain();

      put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
    });

    it('should construct and save vaults definitions to ddb', async () => {
      await captureVaultData();

      // TODO: remove magic numbers - let's tie this back somewhere waaaaaa
      expect(put.mock.calls.length).toBe(38);
    });

    it('should skip, and warn if no vault was fetched from registry', async () => {
      jest.spyOn(RegistryService.prototype, 'getProductionVaults').mockImplementation(async () => []);
      jest.spyOn(RegistryService.prototype, 'getDevelopmentVaults').mockImplementation(async () => []);

      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

      await captureVaultData();

      expect(consoleWarnMock.mock.calls.length).toBe(getSupportedChains().length);
      expect(put.mock.calls.length).toBe(0);
    });

    it('should skip, and warn if no vault was fetched from the graph', async () => {
      jest.spyOn(BadgerGraph.prototype, 'loadSett').mockImplementation(async () => ({ sett: null }));

      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

      await captureVaultData();

      // TODO: remove magic numbers - let's tie this back somewhere
      expect(consoleWarnMock.mock.calls.length).toBe(38);
      expect(put.mock.calls.length).toBe(0);
    });

    it('should mark vault in ddb and not in registryVaults response as isProduction = 0', async () => {
      const savedProductionValues = [];
      const savedVaults = [registryVaults[0], registryVaults[1], registryVaults[2]];

      jest.spyOn(RegistryService.prototype, 'getProductionVaults').mockImplementation(async function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ((<BadgerSDK>this).config.network != 'ethereum') {
          return [];
        }
        return <RegistryVault[]>registryVaults.filter((v) => !savedVaults.map((v) => v.address).includes(v.address));
      });
      jest.spyOn(RegistryService.prototype, 'getDevelopmentVaults').mockImplementation(async () => []);

      mockQuery<typeof VaultsCompoundMock[0], VaultDefinitionModel>(VaultsCompoundMock, (_, keyCondition) => {
        return (items) => {
          let dataSource = items;
          const savedAddrs = savedVaults.map((v) => v.address);

          if (keyCondition.chain) dataSource = dataSource.filter((v) => v.chain === keyCondition.chain);
          if (keyCondition.isProduction)
            dataSource = dataSource.filter((v) => v.isProduction === keyCondition.isProduction);

          dataSource = dataSource.filter((v) => savedAddrs.includes(v.address));

          return dataSource;
        };
      });

      jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async (inst) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (savedVaults.map((v) => v.address).includes(inst.address) && inst.isProduction === 0) {
          savedProductionValues.push(true);
        }
        return inst;
      });

      await captureVaultData();

      expect(savedProductionValues.length).toBe(savedVaults.length);
    });
  });
});
