import { Network, ValueSource } from '@badger-dao/sdk';
import { SourceType } from '../../rewards/enums/source-type.enum';
export declare class YieldSource implements ValueSource {
    id: string;
    chainAddress: string;
    chain: Network;
    address: string;
    type: SourceType;
    name: string;
    apr: number;
    boostable: boolean;
    minApr: number;
    maxApr: number;
}
