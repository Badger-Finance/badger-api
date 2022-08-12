import { VaultSnapshot } from '@badger-dao/sdk';
import { VaultStrategy } from '../../vaults/interfaces/vault-strategy.interface';
export declare class CurrentVaultSnapshotModel implements VaultSnapshot {
    block: number;
    timestamp: number;
    address: string;
    available: number;
    balance: number;
    strategyBalance: number;
    totalSupply: number;
    pricePerFullShare: number;
    ratio?: number;
    strategy: VaultStrategy;
    boostWeight: number;
    value: number;
    apr: number;
    yieldApr: number;
    harvestApr: number;
}
