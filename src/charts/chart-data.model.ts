import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export abstract class ChartData<T> {
  @attribute()
  id!: string;

  @attribute()
  timestamp!: number;

  abstract toBlankData(): T;
}
