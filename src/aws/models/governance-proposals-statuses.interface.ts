import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class GovernanceProposalsStatuses {
  @attribute()
  name!: string;

  @attribute()
  sender!: string;

  @attribute()
  status!: string;

  @attribute()
  transactionHash!: string;

  @attribute()
  blockNumber!: number;

  @attribute()
  updatedAt!: number;
}
