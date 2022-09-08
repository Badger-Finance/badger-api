import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network, YieldEvent, YieldType } from '@badger-dao/sdk';

import { VAULT_YIELD_DATA } from '../../config/constants';

@table(VAULT_YIELD_DATA)
export class VaultYieldEvent implements YieldEvent {
  @hashKey()
  id!: string;

  @rangeKey({ defaultProvider: () => Date.now() })
  timestamp!: number;

  @attribute()
  chain!: Network;

  @attribute()
  vault!: string;

  @attribute({
    indexKeyConfigurations: {
      IndexYieldDataOnAddress: 'HASH',
    },
  })
  chainAddress!: string;

  @attribute()
  block!: number;

  @attribute()
  amount!: number;

  @attribute()
  balance!: number;

  @attribute()
  value!: number;

  @attribute()
  earned!: number;

  @attribute()
  apr!: number;

  @attribute()
  grossApr!: number;

  @attribute()
  type!: YieldType;

  @attribute()
  token!: string;

  @attribute()
  tx!: string;
}
