import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { TOKEN_BALANCES_DATA } from '../../config/constants';
import { CachedTokenBalance } from './cached-token-balance.interface';

@table(TOKEN_BALANCES_DATA)
export class CachedLiquidityPoolTokenBalance {
  @hashKey()
  id!: string;

  @attribute({
    indexKeyConfigurations: {
      IndexLiquidityPoolTokenBalancesOnPairIdAndProtocol: 'HASH',
    },
  })
  pairId!: string;

  @attribute({
    indexKeyConfigurations: {
      IndexLiquidityPoolTokenBalancesOnPairIdAndProtocol: 'RANGE',
    },
  })
  protocol!: string;

  @attribute({ memberType: embed(CachedTokenBalance) })
  tokenBalances!: Array<CachedTokenBalance>;
}
