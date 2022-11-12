import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class GovernanceProposalsDisputes {
  @attribute()
  name!: string;

  @attribute()
  ruling!: boolean;

  @attribute()
  sender!: string;

  @attribute()
  transactionHash!: string;

  @attribute()
  updatedAt!: number;
}
