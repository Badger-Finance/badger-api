import { Token } from '@badger-dao/sdk';

import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { TOKEN_INFORMATION_DATA } from '../../config/constants';

@table(TOKEN_INFORMATION_DATA)
export class TokenInformationSnapshot implements Token {
  @hashKey()
  address!: string;

  @attribute()
  name!: string;

  @attribute()
  symbol!: string;

  @attribute()
  decimals!: number;
}
