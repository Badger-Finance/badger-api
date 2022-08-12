import { ValueSource, VaultDTO, VaultSnapshot } from '@badger-dao/sdk';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
export declare const TEST_ADDR: string;
export declare const TEST_CURRENT_TIMESTAMP = 1660223160457;
export declare const MOCK_DISTRIBUTION_FILE: {
    merkleRoot: string;
    cycle: number;
    tokenTotal: {
        [x: string]: number;
    };
    claims: {
        [x: string]: {
            index: string;
            cycle: string;
            user: string;
            tokens: string[];
            cumulativeAmounts: string[];
            proof: string[];
            node: string;
        };
    };
};
export declare const MOCK_BOUNCER_FILE: {
    merkleRoot: string;
    tokenTotal: number;
    claims: {
        [x: string]: {
            index: string;
            amount: number;
            proof: string[];
        };
    };
};
export declare const MOCK_VAULT_DEFINITION: VaultDefinitionModel;
export declare const MOCK_VAULTS: VaultDTO[];
export declare const MOCK_VAULT: VaultDTO;
export declare const MOCK_VAULT_SNAPSHOTS: VaultSnapshot[];
export declare const MOCK_VAULT_SNAPSHOT: VaultSnapshot;
export declare const MOCK_YIELD_SOURCES: ValueSource[];
