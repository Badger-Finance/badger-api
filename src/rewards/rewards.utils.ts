import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { REWARD_DATA } from '../config/constants';
import { RewardMerkleDistribution } from './interfaces/merkle-distributor.interface';

export async function getTreeDistribution(chain: Chain): Promise<RewardMerkleDistribution | null> {
  if (!chain.badgerTree) {
    return null;
  }
  const appendChainId = chain.network != ChainNetwork.Ethereum;
  const fileName = `badger-tree${appendChainId ? `-${parseInt(chain.chainId, 16)}` : ''}.json`;
  const rewardFile = await getObject(REWARD_DATA, fileName);
  return JSON.parse(rewardFile.toString('utf-8'));
}
