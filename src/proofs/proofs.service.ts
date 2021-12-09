import { MerkleProof } from '@badger-dao/sdk/lib/api/types/merkle-proof';
import { Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';
import { AirdropMerkleDistribution } from '../rewards/interfaces/merkle-distributor.interface';

@Service()
export class ProofsService {
  /**
   * Load user bouncer proof. These proofs are used for vault guest lists.
   * @param address User Ethereum address.
   */
  async getBouncerProof(chain: Chain, address: string): Promise<MerkleProof> {
    const fileName = `badger-bouncer-${parseInt(chain.chainId)}.json`;
    const bouncerFile = await getObject(REWARD_DATA, fileName);
    if (!bouncerFile) {
      throw new NotFound(`${chain.name} does not have a bouncer list`);
    }
    const fileContents: AirdropMerkleDistribution = JSON.parse(bouncerFile.toString('utf-8'));
    const claim = fileContents.claims[ethers.utils.getAddress(address)];
    if (!claim) {
      throw new NotFound(`${address} is not on the bouncer list`);
    }
    return claim.proof;
  }
}
