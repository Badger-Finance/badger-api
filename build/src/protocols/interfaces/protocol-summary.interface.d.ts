import { VaultSummary } from '../../vaults/interfaces/vault-summary.interface';
export interface ProtocolSummary {
    totalValue: number;
    setts?: VaultSummary[];
    vaults?: VaultSummary[];
}
