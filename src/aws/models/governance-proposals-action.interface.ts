import { embed } from '@aws/dynamodb-data-mapper';
import { attribute } from '@aws/dynamodb-data-mapper-annotations';

import { GovernanceProposalsStatuses } from './governance-proposals-statuses.interface';

export class GovernanceProposalsAction {
  @attribute()
  index!: number;

  @attribute()
  value!: number;

  @attribute()
  callData!: string;

  @attribute()
  decodedCallData!: string;

  @attribute()
  targetAddr!: string;

  @attribute()
  predecessor!: string;

  @attribute()
  transactionHash!: string;

  @attribute({ memberType: embed(GovernanceProposalsStatuses) })
  executed!: string;

  @attribute()
  sender!: string;
}
