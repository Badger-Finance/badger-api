import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { LIQUIDITY_POOL_TOKEN_BALANCES_DATA } from '../../config/constants';
import { CachedTokenBalance } from './cached-token-balance.interface';

@table(LIQUIDITY_POOL_TOKEN_BALANCES_DATA)
export class CachedLiquidityPoolTokenBalance {
  @hashKey()
  id!: string;

  @attribute()
  pairId!: string;

  @attribute()
  protocol!: string;

  @attribute({ memberType: embed(CachedTokenBalance) })
  tokenBalances!: Array<CachedTokenBalance>;
}
