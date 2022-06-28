import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { Token } from '@badger-dao/sdk/lib/tokens/interfaces/token.interface';

export class TokenDestructor implements Token {
  @attribute()
  address!: string;

  @attribute()
  name!: string;

  @attribute()
  symbol!: string;

  @attribute()
  decimals!: number;
}
