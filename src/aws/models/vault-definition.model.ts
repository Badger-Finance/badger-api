import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { BouncerType, Network, Protocol, VaultBehavior, VaultState, VaultVersion } from '@badger-dao/sdk';

import { STAGE, VAULT_COMPOUND_DATA } from '../../config/constants';
import { Stage } from '../../config/enums/stage.enum';
import { IVaultDefinition } from '../interfaces/vault-definition-model.interface';

@table(VAULT_COMPOUND_DATA)
export class VaultDefinitionModel implements IVaultDefinition {
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
  chain!: Network;

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

  @attribute()
  isMigrating!: boolean;

  isStageVault(): boolean {
    return this.stage === STAGE;
  }
}
