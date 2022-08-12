import { Currency, Network, VaultSnapshot } from '@badger-dao/sdk';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { VaultModel } from './interfaces/vault-model.interface';
import { VaultsService } from './vaults.service';
export declare class VaultsV3Controller {
    vaultService: VaultsService;
    getVault(address: string, chain?: Network, currency?: Currency): Promise<VaultModel>;
    listVaults(chain?: Network, currency?: Currency): Promise<VaultModel[]>;
    getVaultsHarvests(vault: string, chain?: Network): Promise<VaultHarvestsExtendedResp[]>;
    getlistVaultHarvests(chain?: Network): Promise<VaultHarvestsMap>;
    getVaultSnapshotsInRange(vault: string, timestamps: string, chain?: Network): Promise<VaultSnapshot[]>;
}
