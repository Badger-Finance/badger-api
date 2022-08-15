import { DataMapper, PutParameters, StringToAnyObjectMap } from "@aws/dynamodb-data-mapper";
import { BadgerGraph, BadgerSDK, RegistryVault, VaultsService } from "@badger-dao/sdk";
import * as gqlGenT from "@badger-dao/sdk/lib/graphql/generated/badger";
import graphVaults from "@badger-dao/sdk-mocks/generated/ethereum/graph/loadSetts.json";
import registryVaults from "@badger-dao/sdk-mocks/generated/ethereum/vaults/loadVaults.json";
import { mockQuery } from "src/test/mocks.utils";

import { SUPPORTED_CHAINS } from "../chains/chain";
import { TEST_CURRENT_TIMESTAMP } from "../test/constants";
import { mockSupportedChains, setupVaultsCoumpoundDDB } from "../test/tests.utils";
import { captureVaultData } from "./vault-definition-indexer";

describe("vault-definition-indexer", () => {
  describe("captureVaultData", () => {
    let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [items: PutParameters<StringToAnyObjectMap>]>;

    beforeEach(async () => {
      jest.spyOn(Date, "now").mockImplementation(() => TEST_CURRENT_TIMESTAMP);
      jest.spyOn(console, "error").mockImplementation();
      jest.spyOn(console, "warn").mockImplementation();

      mockQuery([]);

      jest.spyOn(VaultsService.prototype, "loadVaults").mockImplementation(async function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ((<BadgerSDK>this).config.network != "ethereum") return [];
        return <RegistryVault[]>registryVaults;
      });
      jest.spyOn(BadgerGraph.prototype, "loadSett").mockImplementation(async ({ id }) => {
        const graphVault = graphVaults.setts.find((v) => v.id === id);

        if (!graphVault) return { sett: null };

        return { sett: <gqlGenT.SettQuery["sett"]>graphVault, __typename: "Query" };
      });

      await mockSupportedChains();

      put = jest.spyOn(DataMapper.prototype, "put").mockImplementation();
    });

    it("should construct and save vaults definitions to ddb", async () => {
      await captureVaultData();

      expect(put.mock.calls.length).toBe(24);
    });

    it("should skip, and warn if no vault was fetched from registry", async () => {
      jest.spyOn(VaultsService.prototype, "loadVaults").mockImplementation(async () => []);

      const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();

      await captureVaultData();

      expect(consoleWarnMock.mock.calls.length).toBe(SUPPORTED_CHAINS.length);
      expect(put.mock.calls.length).toBe(0);
    });

    it("should skip, and warn if no vault was fetched from the graph", async () => {
      jest.spyOn(BadgerGraph.prototype, "loadSett").mockImplementation(async () => ({ sett: null }));

      const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();

      await captureVaultData();

      expect(consoleWarnMock.mock.calls.length).toBe(29);
      expect(put.mock.calls.length).toBe(0);
    });

    it("should mark vault in ddb and not in registryVaults response as isProduction = 0", async () => {
      const savedProductionValues = [];
      const savedVaults = [registryVaults[0], registryVaults[1], registryVaults[2]];

      jest.spyOn(VaultsService.prototype, "loadVaults").mockImplementation(async function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if ((<BadgerSDK>this).config.network != "ethereum") return [];
        return <RegistryVault[]>registryVaults.filter((v) => !savedVaults.map((v) => v.address).includes(v.address));
      });

      setupVaultsCoumpoundDDB((v) => {
        return savedVaults.map((v) => v.address).includes(v.address);
      });

      jest.spyOn(DataMapper.prototype, "put").mockImplementation(async (inst) => {
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
