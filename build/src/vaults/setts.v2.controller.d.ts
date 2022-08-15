import { Currency, Network } from "@badger-dao/sdk";
import { VaultModel } from "./interfaces/vault-model.interface";
import { VaultsService } from "./vaults.service";
export declare class SettsV2Controller {
  vaultsService: VaultsService;
  listSetts(chain?: Network, currency?: Currency): Promise<VaultModel[]>;
  getSett(vault: string, chain?: Network, currency?: Currency): Promise<VaultModel>;
}
