import { VaultSummary } from '../../vaults/interfaces/vault-summary.interface';
import { ProtocolSummary } from './protocol-summary.interface';
export declare class ProtocolSummaryModel implements ProtocolSummary {
    totalValue: number;
    setts?: VaultSummary[];
    constructor(protocolSummary: ProtocolSummary);
}
