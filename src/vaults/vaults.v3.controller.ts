import { Currency, Network, VaultSnapshot } from "@badger-dao/sdk";
import { Controller, Inject } from "@tsed/di";
import { UseCache } from "@tsed/platform-cache";
import { QueryParams } from "@tsed/platform-params";
import { ContentType, Description, Get, Hidden, Returns, Summary } from "@tsed/schema";

import { Chain } from "../chains/config/chain.config";
import { QueryParamError } from "../errors/validation/query.param.error";
import { VaultHarvestsExtendedResp } from "./interfaces/vault-harvest-extended-resp.interface";
import { VaultHarvestsMap } from "./interfaces/vault-harvest-map";
import { VaultHarvestsMapModel } from "./interfaces/vault-harvests-list-model.interface";
import { VaultHarvestsModel } from "./interfaces/vault-harvests-model.interface";
import { VaultModel } from "./interfaces/vault-model.interface";
import { VaultsService } from "./vaults.service";

@Controller("/vaults")
export class VaultsV3Controller {
  @Inject()
  vaultService!: VaultsService;

  @Get()
  @ContentType("json")
  @Summary("Get a specific vault")
  @Description("Return a specific vault for the requested chain")
  @Returns(200, VaultModel)
  @Returns(400).Description("Not a valid chain")
  @Returns(404).Description("Not a valid vault")
  async getVault(
    @QueryParams("address") address: string,
    @QueryParams("chain") chain?: Network,
    @QueryParams("currency") currency?: Currency
  ): Promise<VaultModel> {
    if (!address) {
      throw new QueryParamError("vault");
    }

    const chainInst = Chain.getChain(chain);
    const compoundVault = await chainInst.vaults.getVault(address);
    return VaultsService.loadVault(chainInst, compoundVault, currency);
  }

  @Get("/list")
  @ContentType("json")
  @Summary("Get a list of protocol vaults")
  @Description("Return a list of protocol vaults for the requested chain")
  @Returns(200, VaultModel)
  @Returns(400).Description("Not a valid chain")
  async listVaults(
    @QueryParams("chain") chain?: Network,
    @QueryParams("currency") currency?: Currency
  ): Promise<VaultModel[]> {
    return this.vaultService.listVaults(Chain.getChain(chain), currency);
  }

  @Get("/harvests")
  @ContentType("json")
  @Summary("Get harvests on a specific vault")
  @Description("Return full list of vault`s harvests")
  @Returns(200, Array).Of(VaultHarvestsModel)
  @Returns(400).Description("Not a valid chain")
  async getVaultsHarvests(
    @QueryParams("vault") vault: string,
    @QueryParams("chain") chain?: Network
  ): Promise<VaultHarvestsExtendedResp[]> {
    if (!vault) {
      throw new QueryParamError("vault");
    }

    return this.vaultService.getVaultHarvests(Chain.getChain(chain), vault);
  }

  @Get("/list/harvests")
  @UseCache()
  @ContentType("json")
  @Summary("Get all vaults harvests on a chain")
  @Description("Return map of vaults, with harvests")
  @Returns(200, VaultHarvestsMapModel)
  @Returns(400).Description("Not a valid chain")
  async getlistVaultHarvests(@QueryParams("chain") chain?: Network): Promise<VaultHarvestsMap> {
    return this.vaultService.listVaultHarvests(Chain.getChain(chain));
  }

  @Hidden()
  @UseCache()
  @Get("/snapshots")
  @ContentType("json")
  async getVaultSnapshotsInRange(
    @QueryParams("vault") vault: string,
    @QueryParams("timestamps") timestamps: string,
    @QueryParams("chain") chain?: Network
  ): Promise<VaultSnapshot[]> {
    if (!vault) {
      throw new QueryParamError("vault");
    }
    if (!timestamps) {
      throw new QueryParamError("timestamps");
    }

    const timestampsList = timestamps.split(",").map((n) => Number(n));
    const isTimestampsValid = timestampsList.every((time) => time > 0);

    if (!isTimestampsValid) {
      throw new QueryParamError("timestamps");
    }

    return this.vaultService.getVaultChartDataByTimestamps(vault, Chain.getChain(chain), timestampsList);
  }
}
