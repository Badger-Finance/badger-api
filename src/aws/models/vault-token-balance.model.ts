import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { VAULT_BALANCES_DATA } from '../../config/constants';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';

@table(VAULT_BALANCES_DATA)
export class VaultTokenBalance {
  @hashKey()
  vault!: string;

  @attribute({ memberType: embed(CachedTokenBalance) })
  tokenBalances!: Array<CachedTokenBalance>;
}
