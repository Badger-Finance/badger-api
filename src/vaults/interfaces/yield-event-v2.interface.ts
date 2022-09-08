import { VaultEarning } from '@badger-dao/sdk';

export interface YieldEventV2 extends VaultEarning {
  tx: string;
}
