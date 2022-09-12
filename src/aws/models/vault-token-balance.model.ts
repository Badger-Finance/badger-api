import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network } from '@badger-dao/sdk';

import { VAULT_BALANCES_DATA } from '../../config/constants';
import { CachedTokenBalance } from './cached-token-balance.interface';

@table(VAULT_BALANCES_DATA)
export class VaultTokenBalance {
  @hashKey()
  id!: string;

  @attribute()
  chain!: Network;

  @attribute()
  vault!: string;

  @attribute({ memberType: embed(CachedTokenBalance) })
  tokenBalances!: Array<CachedTokenBalance>;
}
