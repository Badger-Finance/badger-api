import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class GovernanceProposalsStatuses {
  @attribute()
  name!: string;

  @attribute()
  sender!: string;

  @attribute()
  transactionHash!: string;

  @attribute()
  updatedAt!: number;
}
