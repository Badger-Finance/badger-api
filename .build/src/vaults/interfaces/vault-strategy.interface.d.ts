import { VaultStrategy as IVaultStrategy } from '@badger-dao/sdk';
export declare class VaultStrategy implements IVaultStrategy {
    address: string;
    withdrawFee: number;
    performanceFee: number;
    strategistFee: number;
    aumFee: number;
}
