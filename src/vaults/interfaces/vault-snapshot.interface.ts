import { VaultStrategy } from '@badger-dao/sdk';

export interface IVaultSnapshot {
  block: number;
  timestamp: number;
  address: string;
  available: number;
  balance: number;
  totalSupply: number;
  pricePerFullShare: number;
  value: number;
  strategy: VaultStrategy;
  boostWeight: number;
}
