import { Service } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { S3Service } from '../aws/S3Service';
import { MERKLE_CLAIM_BUCKET } from '../config/constants';
import {
  AirdropMerkleClaim,
  AirdropMerkleDistribution,
  RewardMerkleClaim,
  RewardMerkleDistribution,
} from '../interface/MerkleDistribution';

@Service()
export class RewardService {
  constructor(private s3Service: S3Service) {}

  /**
   * Get airdrop merkle claim for a user.
   * @param airdrop Airdrop JSON filename.
   * @param address User Ethereum address.
   */
  async getUserAirdrop(airdrop: string, address: string): Promise<AirdropMerkleClaim> {
    const airdropFile = await this.s3Service.getObject(MERKLE_CLAIM_BUCKET, airdrop);
    if (!airdropFile.Body) {
      console.warn(`${airdrop} file has no content`);
      throw new BadRequest('Invalid airdrop request');
    }
    const fileContents: AirdropMerkleDistribution = JSON.parse(airdropFile.Body.toString('utf-8'));
    const claim = fileContents.claims[address.toLowerCase()];
    if (!claim) {
      throw new NotFound(`${address} does not qualify for airdrop`);
    }
    return claim;
  }

  /**
   * Get badger tree reward merkle claim for a user.
   * @param address User Ethereum address.
   */
  async getUserRewards(address: string): Promise<RewardMerkleClaim> {
    const rewardFile = await this.s3Service.getObject(MERKLE_CLAIM_BUCKET, 'badger-tree.json');
    if (!rewardFile.Body) {
      console.warn(`badger-tree.json has no content`);
      throw new BadRequest('Invalid reward file request');
    }
    const fileContents: RewardMerkleDistribution = JSON.parse(rewardFile.Body.toString('utf-8'));
    const claim = fileContents.claims[address];
    if (!claim) {
      throw new NotFound(`${address} does not have claimable rewards.`);
    }
    return claim;
  }
}
