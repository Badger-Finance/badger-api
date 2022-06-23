import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { CachedSettBalance } from '../../accounts/interfaces/cached-sett-balance.interface';
import { ACCOUNT_DATA } from '../../config/constants';

@table(ACCOUNT_DATA)
export class CachedAccount {
  @hashKey()
  address!: string;

  @attribute({ memberType: embed(CachedSettBalance) })
  balances!: Array<CachedSettBalance>;

  @attribute({ defaultProvider: () => Date.now() })
  updatedAt!: number;
}
