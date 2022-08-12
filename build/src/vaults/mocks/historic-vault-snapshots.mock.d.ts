import { VaultSnapshot } from '@badger-dao/sdk';
import { HistoricVaultSnapshotModel } from '../../aws/models/historic-vault-snapshot.model';
declare type HistoricVaultSnapshotsMock = {
    data: ({
        id: HistoricVaultSnapshotModel['id'];
    } & VaultSnapshot)[];
    timeframe: string;
    id: string;
};
export declare const historicVaultSnapshotsMock: HistoricVaultSnapshotsMock[];
export {};
