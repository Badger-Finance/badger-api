import { Network } from '@badger-dao/sdk';
import { GovernanceProposal } from '@badger-dao/sdk/lib/api/interfaces/governance-proposal.interface';

import { getDataMapper } from '../aws/dynamodb.utils';
import { GovernanceProposals } from '../aws/models/governance-proposals.model';
import { Chain } from '../chains/config/chain.config';
import { NodataForChainError } from '../errors/allocation/nodata.for.chain.error';
import { DdbError } from '../errors/internal/ddb.error';
import { EMPTY_DECODED_CALLDATA_INDEXED } from './governance.constants';

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
      if (offsetCounter < offset && offset !== 0) {
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

export async function getProposalsWithEmptyDecodedCallData() {
  const mapper = getDataMapper();

  const proposals: GovernanceProposals[] = [];

  try {
    for await (const proposal of mapper.query(
      GovernanceProposals,
      { decodedCallData: EMPTY_DECODED_CALLDATA_INDEXED },
      {
        limit: 100,
        indexName: 'IndexGovernanceProposalsDecodedCallData',
      },
    )) {
      proposals.push(proposal);
    }
  } catch (err) {
    console.error(err);
    throw new DdbError(`${err}`);
  }

  return proposals;
}

export function unpackDdbDecodedCallData(decodedCallData: string): GovernanceProposal['actions'][0]['decodedCallData'] {
  if (decodedCallData === EMPTY_DECODED_CALLDATA_INDEXED) return null;

  try {
    return JSON.parse(decodedCallData);
  } catch (_) {
    return null;
  }
}

export function packDdbProposalForResponse(proposal: GovernanceProposals): GovernanceProposal {
  return {
    proposalId: proposal.proposalId,
    createdAt: proposal.createdAt,
    contractAddr: proposal.contractAddr,
    readyTime: proposal.readyTime,
    currentStatus: proposal.currentStatus,
    creationBlock: proposal.creationBlock,
    updateBlock: proposal.updateBlock,
    description: proposal.description,
    statuses: proposal.statuses,
    disputes: proposal.disputes,
    actions: proposal.actions.map((action) => ({
      ...action,
      decodedCallData: unpackDdbDecodedCallData(action.decodedCallData),
    })),
  };
}
