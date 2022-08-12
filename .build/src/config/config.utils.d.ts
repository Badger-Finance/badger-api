import { ContractRegistry } from './interfaces/contract-registry.interface';
export declare const checksumEntries: (registry: ContractRegistry) => ContractRegistry;
export declare const getEnvVar: (envName: string) => string;
export declare function isSlsOffline(): boolean;
export declare function isJestEnv(): boolean;
