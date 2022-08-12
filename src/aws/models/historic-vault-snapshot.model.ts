import { embed } from '@aws/dynamodb-data-mapper';
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { VaultSnapshot } from '@badger-dao/sdk';

import { ChartData } from '../../charts/chart-data.model';
import { VaultStrategy } from '../../vaults/interfaces/vault-strategy.interface';

export class HistoricVaultSnapshotModel extends ChartData<HistoricVaultSnapshotModel> implements VaultSnapshot {
  static NAMESPACE = 'vault';

  @attribute()
  chain!: string;

  @attribute()
  address!: string;

  @attribute()
  block!: number;

  @attribute()
  available!: number;

  @attribute()
  balance!: number;

  @attribute()
  strategyBalance!: number;

  @attribute()
  totalSupply!: number;

  @attribute()
  pricePerFullShare!: number;

  @attribute()
  ratio?: number;

  @attribute({ memberType: embed(VaultStrategy) })
  strategy!: VaultStrategy;

  @attribute()
  boostWeight!: number;

  @attribute()
  value!: number;

  @attribute()
  apr!: number;

  @attribute()
  yieldApr!: number;

  @attribute()
  harvestApr!: number;

  toBlankData(): HistoricVaultSnapshotModel {
    const copy = JSON.parse(JSON.stringify(this));
    copy.block = 0;
    copy.available = 0;
    copy.balance = 0;
    copy.strategyBalance = 0;
    copy.totalSupply = 0;
    copy.pricePerFullShare = 0;
    copy.totalSupply = 0;
    copy.ratio = 0;
    copy.boostWeight = 0;
    copy.value = 0;
    copy.balance = 0;
    copy.apr = 0;
    copy.yieldApr = 0;
    copy.harvestApr = 0;
    copy.strategy = {};
    return copy;
  }
}
