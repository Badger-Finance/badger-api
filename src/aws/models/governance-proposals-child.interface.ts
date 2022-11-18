import { embed } from '@aws/dynamodb-data-mapper';
import { attribute } from '@aws/dynamodb-data-mapper-annotations';

import { GovernanceProposalsStatuses } from './governance-proposals-statuses.interface';

export class GovernanceProposalsChild {
  @attribute()
  index!: number;

  @attribute()
  value!: number;

  @attribute()
  callData!: string;

  @attribute()
  targetAddr!: string;

  @attribute()
  predecessor!: string;

  @attribute({ memberType: embed(GovernanceProposalsStatuses) })
  executed!: GovernanceProposalsStatuses;

  @attribute()
  sender!: string;
}
