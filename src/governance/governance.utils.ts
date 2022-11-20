import { Network } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { GovernanceProposals } from '../aws/models/governance-proposals.model';
import { Chain } from '../chains/config/chain.config';
import { NodataForChainError } from '../errors/allocation/nodata.for.chain.error';
import { DdbError } from '../errors/internal/ddb.error';

export async function getLastProposalUpdateBlock(network: Network) {
  const mapper = getDataMapper();

  try {
    for await (const item of mapper.query(
      GovernanceProposals,
      { network },
      { limit: 1, indexName: 'IndexGovernanceProposalsUpdateBlock', scanIndexForward: false },
    )) {
      return item.updateBlock || null;
    }
  } catch (_) {
    return null;
  }

  return null;
}

export async function getProposalByIdx(chain: Chain, proposalId: string) {
  const mapper = getDataMapper();
  const timelockAddress = chain.sdk.governance.timelockAddress;

  if (!timelockAddress) {
    throw new NodataForChainError(chain.network);
  }

  let proposal: GovernanceProposals | undefined;

  try {
    for await (const item of mapper.query(
      GovernanceProposals,
      { idx: GovernanceProposals.genIdx(chain.network, timelockAddress, proposalId) },
      {
        limit: 1,
        scanIndexForward: false,
      },
    )) {
      proposal = item;
    }
  } catch (err) {
    console.error(err);
    throw new DdbError(`${err}`);
  }

  return proposal;
}

// we can try to use PaginationQuery, but it looks like it does same iterations
// one thing, that it can save some network traffic between app and ddb
export async function countProposalsByNetwork(network: Network) {
  const mapper = getDataMapper();

  let count = 0;

  try {
    for await (const _ of mapper.query(
      GovernanceProposals,
      { network },
      { indexName: 'IndexGovernanceProposalsUpdateBlock' },
    )) {
      count++;
    }
  } catch (err) {
    console.error(err);
    throw new DdbError(`${err}`);
  }

  return count;
}

export async function getProposalsList(network: Network, limit: number, offset: number) {
  const mapper = getDataMapper();

  const proposals: GovernanceProposals[] = [];

  const innerLimit = limit + offset;
  let offsetCounter = 0;

  try {
    for await (const item of mapper.query(
      GovernanceProposals,
      { network },
      {
        limit: innerLimit,
        indexName: 'IndexGovernanceProposalsUpdateBlock',
        scanIndexForward: false,
      },
    )) {
      if (offsetCounter <= offset && offset !== 0) {
        offsetCounter++;
        continue;
      }

      proposals.push(item);
    }
  } catch (err) {
    console.error(err);
    throw new DdbError(`${err}`);
  }

  return proposals;
}
