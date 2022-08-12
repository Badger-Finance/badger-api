import { HarvestType } from '../../vaults/enums/harvest.enum';
import { VaultHarvestsExtended } from '../../vaults/interfaces/vault-harvest-extended.interface';
export declare class HarvestCompoundData implements VaultHarvestsExtended {
    vault: string;
    timestamp: number;
    amount: number;
    strategyBalance: number;
    block: number;
    estimatedApr: number;
    eventType: HarvestType;
    token: string;
}
