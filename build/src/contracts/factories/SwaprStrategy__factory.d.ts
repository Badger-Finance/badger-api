import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { SwaprStrategy, SwaprStrategyInterface } from '../SwaprStrategy';
export declare class SwaprStrategy__factory {
    static readonly abi: {
        inputs: never[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): SwaprStrategyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SwaprStrategy;
}
