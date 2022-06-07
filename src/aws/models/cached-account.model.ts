import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ACCOUNT_DATA } from '../../config/constants';
import { CachedSettBalance } from '../../accounts/interfaces/cached-sett-balance.interface';

@table(ACCOUNT_DATA)
export class CachedAccount {
  @hashKey()
  address!: string;

  @attribute({ memberType: embed(CachedSettBalance) })
  balances!: Array<CachedSettBalance>;
}
