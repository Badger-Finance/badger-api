import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { CurvePool, CurvePoolInterface } from '../CurvePool';
export declare class CurvePool__factory {
    static readonly abi: {
        constant: boolean;
        inputs: {
            type: string;
            name: string;
        }[];
        name: string;
        outputs: {
            type: string;
            name: string;
        }[];
        payable: boolean;
        type: string;
    }[];
    static createInterface(): CurvePoolInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): CurvePool;
}
