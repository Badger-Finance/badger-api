import { Network } from '@badger-dao/sdk';
import { MerkleProof } from '@badger-dao/sdk/lib/api/types/merkle-proof';
import { ProofsService } from './proofs.service';
export declare class ProofsV2Controller {
    proofsService: ProofsService;
    getBouncerProof(address: string, chain?: Network): Promise<MerkleProof>;
}
