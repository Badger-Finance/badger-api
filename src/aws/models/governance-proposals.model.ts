import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network } from '@badger-dao/sdk';

import { GOVERNANCE_PROPOSALS_DATA } from '../../config/constants';
import { GovernanceProposalsDisputes } from './governance-proposals-disputes.interface';
import { GovernanceProposalsStatuses } from './governance-proposals-statuses.interface';

@table(GOVERNANCE_PROPOSALS_DATA)
export class GovernanceProposals {
  @hashKey()
  idx!: string;

  @rangeKey()
  createdAt!: number;

  @attribute()
  proposalId!: string;

  @attribute()
  network!: string;

  @attribute()
  contractAddr!: string;

  @attribute()
  targetAddr!: string;

  @attribute()
  value!: number;

  @attribute()
  callData!: string;

  @attribute()
  predecessor!: string;

  @attribute()
  readyTime!: number;

  @attribute()
  sender!: string;

  @attribute()
  currentStatus!: string;

  @attribute({ memberType: embed(GovernanceProposalsStatuses) })
  statuses!: Array<GovernanceProposalsStatuses>;

  @attribute({ memberType: embed(GovernanceProposalsDisputes) })
  disputes!: Array<GovernanceProposalsDisputes>;

  static genIdx(network: Network, contractAddr: string, proposalId: string) {
    return `${network}-${contractAddr}-${proposalId}`;
  }
}
