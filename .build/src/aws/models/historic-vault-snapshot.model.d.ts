import { VaultSnapshot } from "@badger-dao/sdk";
import { ChartData } from "../../charts/chart-data.model";
import { VaultStrategy } from "../../vaults/interfaces/vault-strategy.interface";
export declare class HistoricVaultSnapshotModel extends ChartData<HistoricVaultSnapshotModel> implements VaultSnapshot {
  static NAMESPACE: string;
  id: string;
  chain: string;
  address: string;
  timestamp: number;
  block: number;
  available: number;
  balance: number;
  strategyBalance: number;
  totalSupply: number;
  pricePerFullShare: number;
  ratio?: number;
  strategy: VaultStrategy;
  boostWeight: number;
  value: number;
  apr: number;
  yieldApr: number;
  harvestApr: number;
  toBlankData(): HistoricVaultSnapshotModel;
}
