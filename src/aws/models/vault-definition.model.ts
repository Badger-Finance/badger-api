import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { BouncerType, Network, Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { VAULT_DEFINITION_DATA } from '../../config/constants';
import { Stage } from '../../config/enums/stage.enum';
import { IVaultDefinition } from '../interfaces/vault-definition-model.interface';

@table(VAULT_DEFINITION_DATA)
export class VaultDefinitionModel implements IVaultDefinition {
  @hashKey()
  id!: string;

  @attribute()
  address!: string;

  @attribute()
  createdAt!: number;

  @attribute({
    indexKeyConfigurations: {
      IndexVaultCompoundDataChain: 'HASH',
      IndexVaultCompoundDataChainIsProd: 'HASH'
    }
  })
  chain!: Network;

  // 0 - not in prd onchain map, 1 - yes
  @attribute({
    indexKeyConfigurations: {
      IndexVaultCompoundDataChainIsProd: 'RANGE'
    }
  })
  isProduction!: number;

  @attribute()
  name!: string;

  @attribute()
  bouncer!: BouncerType;

  @attribute()
  stage!: Stage;

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

  @attribute()
  depositToken!: string;

  @attribute()
  updatedAt!: number;

  @attribute()
  releasedAt!: number;

  @attribute()
  isNew!: boolean;
}
