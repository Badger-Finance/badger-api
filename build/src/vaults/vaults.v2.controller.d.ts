import { Currency, Network } from "@badger-dao/sdk";
import { VaultHarvestsExtendedResp } from "./interfaces/vault-harvest-extended-resp.interface";
import { VaultHarvestsMap } from "./interfaces/vault-harvest-map";
import { VaultModel } from "./interfaces/vault-model.interface";
import { VaultsService } from "./vaults.service";
export declare class VaultsV2Controller {
  vaultService: VaultsService;
  listVaults(chain?: Network, currency?: Currency): Promise<VaultModel[]>;
  getlistVaultHarvests(chain?: Network): Promise<VaultHarvestsMap>;
  getVaultsHarvests(vault: string, chain?: Network): Promise<VaultHarvestsExtendedResp[]>;
  getVault(vault: string, chain?: Network, currency?: Currency): Promise<VaultModel>;
}
