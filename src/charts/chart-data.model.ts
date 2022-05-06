import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class ChartData {
  @attribute()
  id!: string;

  @attribute()
  timestamp!: number;
}
