import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class GovernanceProposalsDisputes {
  @attribute()
  name!: string;

  @attribute()
  ruling!: boolean | null;

  @attribute()
  sender!: string;

  @attribute()
  status!: string;

  @attribute()
  data!: string | null;

  @attribute()
  transactionHash!: string;

  @attribute()
  blockNumber!: number;

  @attribute()
  updatedAt!: number;
}
