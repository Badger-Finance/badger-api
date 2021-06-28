import { getObject } from '../aws/s3.utils';
import { REWARD_DATA } from '../config/constants';
import { RewardMerkleDistribution } from './interfaces/merkle-distributor.interface';

export async function getTreeDistribution(): Promise<RewardMerkleDistribution> {
  const rewardFile = await getObject(REWARD_DATA, 'badger-tree.json');
  return JSON.parse(rewardFile.toString('utf-8'));
}
