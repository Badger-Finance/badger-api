import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network } from '@badger-dao/sdk';

import { GOVERNANCE_PROPOSALS_DATA } from '../../config/constants';
import { GovernanceProposalsChild } from './governance-proposals-child.interface';
import { GovernanceProposalsDisputes } from './governance-proposals-disputes.interface';
import { GovernanceProposalsStatuses } from './governance-proposals-statuses.interface';

@table(GOVERNANCE_PROPOSALS_DATA)
export class GovernanceProposals {
  @hashKey()
  idx!: string;

  @attribute()
  proposalId!: string;

  @rangeKey()
  createdAt!: number;

  @attribute({
    indexKeyConfigurations: {
      IndexGovernanceProposalsUpdateBlock: 'HASH',
    },
  })
  network!: string;

  @attribute()
  contractAddr!: string;

  @attribute()
  targetAddr!: string;

  @attribute()
  value!: number;

  @attribute()
  callData!: string;

  @attribute({
    indexKeyConfigurations: {
      IndexGovernanceProposalsDecodedCallData: 'HASH',
    },
  })
  decodedCallData!: string;

  @attribute()
  readyTime!: number;

  @attribute()
  sender!: string;

  @attribute()
  currentStatus!: string;

  @attribute()
  creationBlock!: number;

  @attribute()
  transactionHash!: string;

  @attribute({
    indexKeyConfigurations: {
      IndexGovernanceProposalsUpdateBlock: 'RANGE',
      IndexGovernanceProposalsDecodedCallData: 'RANGE',
    },
  })
  updateBlock!: number;

  @attribute({ memberType: embed(GovernanceProposalsStatuses) })
  statuses!: Array<GovernanceProposalsStatuses>;

  @attribute({ memberType: embed(GovernanceProposalsDisputes) })
  disputes!: Array<GovernanceProposalsDisputes>;

  @attribute({ memberType: embed(GovernanceProposalsChild) })
  children!: Array<GovernanceProposalsChild>;

  static genIdx(network: Network, contractAddr: string, proposalId: string) {
    return `${network}-${contractAddr}-${proposalId}`;
  }
}
