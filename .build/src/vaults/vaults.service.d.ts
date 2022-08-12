import { Currency, VaultDTO } from '@badger-dao/sdk';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
export declare class VaultsService {
    getProtocolSummary(chain: Chain, currency?: Currency): Promise<ProtocolSummary>;
    listVaults(chain: Chain, currency?: Currency): Promise<VaultDTO[]>;
    listVaultHarvests(chain: Chain): Promise<VaultHarvestsMap>;
    getVaultHarvests(chain: Chain, address: string): Promise<VaultHarvestsExtendedResp[]>;
    static loadVault(chain: Chain, vaultDefinition: VaultDefinitionModel, currency?: Currency): Promise<VaultDTO>;
    /**
     *
     * @param vault
     * @param chain
     * @param timestamps
     * @returns
     */
    getVaultChartDataByTimestamps(vault: string, chain: Chain, timestamps: number[]): Promise<HistoricVaultSnapshotModel[]>;
}
