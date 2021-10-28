import { Network } from '@badger-dao/sdk';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';
import { valueSourceToCachedValueSource } from '../indexer/indexer.utils';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource } from '../protocols/interfaces/value-source.interface';
import { tokenEmission } from '../protocols/protocols.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { Token } from '../tokens/interfaces/token.interface';
import { RewardMerkleDistribution } from './interfaces/merkle-distributor.interface';

export async function getTreeDistribution(chain: Chain): Promise<RewardMerkleDistribution | null> {
  if (!chain.badgerTree) {
    return null;
  }
  const appendChainId = chain.network != Network.Ethereum;
  const fileName = `badger-tree${appendChainId ? `-${parseInt(chain.chainId, 16)}` : ''}.json`;
  const rewardFile = await getObject(REWARD_DATA, fileName);
  return JSON.parse(rewardFile.toString('utf-8'));
}

export function noRewards(settDefinition: SettDefinition, token: Token) {
  return valueSourceToCachedValueSource(
    createValueSource(`${token.symbol} Rewards`, uniformPerformance(0)),
    settDefinition,
    tokenEmission(token),
  );
}
