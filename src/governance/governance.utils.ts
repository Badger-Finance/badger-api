import { Network } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { GovernanceProposals } from '../aws/models/governance-proposals.model';

export async function getLastProposalUpdateBlock(network: Network) {
  const mapper = getDataMapper();

  try {
    for await (const item of mapper.query(
      GovernanceProposals,
      { network: network },
      { limit: 1, indexName: 'IndexGovernanceProposalsUpdateBlock', scanIndexForward: false },
    )) {
      return item.updateBlock || null;
    }
  } catch (_) {
    return null;
  }

  return null;
}
