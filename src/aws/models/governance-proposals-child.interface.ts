import { attribute } from '@aws/dynamodb-data-mapper-annotations';

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
  sender!: string;
}
