import { MigrationStatus } from '../../migrations/migration.enums';
declare class MigrationSequence {
    name: string;
    value: string;
    status: MigrationStatus;
}
export declare class MigrationProcessData {
    id: string;
    timestamp: number;
    status: MigrationStatus;
    sequences: MigrationSequence[];
}
export {};
