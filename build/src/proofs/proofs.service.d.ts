import { MerkleProof } from "@badger-dao/sdk";
import { Chain } from "../chains/config/chain.config";
export declare class ProofsService {
  /**
   * Load user bouncer proof. These proofs are used for vault guest lists.
   * @param address User Ethereum address.
   */
  getBouncerProof(chain: Chain, address: string): Promise<MerkleProof>;
}
