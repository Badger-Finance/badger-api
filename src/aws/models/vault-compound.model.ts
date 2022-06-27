import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { ONE_WEEK_SECONDS, VAULT_COMPOUND_DATA } from '../../config/constants';
import { TokenDestructor } from '../../tokens/destructors/token.destructor';
import { BoostDestructor } from '../../vaults/destructors/boost.destructor';
import { VaultStrategy } from '../../vaults/interfaces/vault-strategy.interface';
import { IVaultCompoundModel } from '../interfaces/vault-compound-model.interface';

@table(VAULT_COMPOUND_DATA)
export class VaultCompoundModel implements IVaultCompoundModel {
  @hashKey()
  address!: string;

  @rangeKey()
  createdAt!: number;

  @attribute({
    indexKeyConfigurations: {
      IndexVaultCompoundDataChain: 'HASH',
      IndexVaultCompoundDataChainIsProd: 'HASH',
    },
  })
  chain!: string;

  // 0 - not in prd onchain map, 1 - yes
  @attribute({
    indexKeyConfigurations: {
      IndexVaultCompoundDataChainIsProd: 'RANGE',
    },
  })
  isProduction!: number;

  @attribute()
  name!: string;

  @attribute()
  version!: VaultVersion;

  @attribute()
  state!: VaultState;

  @attribute()
  protocol!: Protocol;

  @attribute()
  behavior!: VaultBehavior;

  @attribute()
  client!: string;

  @attribute({ memberType: embed(TokenDestructor) })
  depositToken!: TokenDestructor;

  @attribute()
  available!: number;

  @attribute()
  block!: number;

  @attribute()
  balance!: number;

  @attribute()
  strategyBalance!: number;

  @attribute()
  totalSupply!: number;

  @attribute()
  pricePerFullShare!: number;

  @attribute({ memberType: embed(VaultStrategy) })
  strategy!: VaultStrategy;

  @attribute({ memberType: embed(BoostDestructor) })
  boost!: BoostDestructor;

  @attribute()
  value!: number;

  @attribute()
  apr!: number;

  @attribute()
  yieldApr!: number;

  @attribute()
  harvestApr!: number;

  @attribute()
  updatedAt!: number;

  @attribute()
  releasedAt!: number;

  @attribute({ defaultProvider: () => Date.now() })
  timestamp!: number;

  isNew() {
    return Date.now() / 1000 - this.releasedAt <= ONE_WEEK_SECONDS * 2;
  }
}
