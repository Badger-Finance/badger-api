import { BouncerType, Network, Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';
import { Stage } from '../../config/enums/stage.enum';
import { IVaultDefinition } from '../interfaces/vault-definition-model.interface';
export declare class VaultDefinitionModel implements IVaultDefinition {
    id: string;
    address: string;
    createdAt: number;
    chain: Network;
    isProduction: number;
    name: string;
    bouncer: BouncerType;
    stage: Stage;
    version: VaultVersion;
    state: VaultState;
    protocol: Protocol;
    behavior: VaultBehavior;
    client: string;
    depositToken: string;
    updatedAt: number;
    releasedAt: number;
    isNew: boolean;
}
