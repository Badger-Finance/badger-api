import { ChartTimeFrame, Network } from "@badger-dao/sdk";
import { HistoricVaultSnapshotModel } from "../aws/models/historic-vault-snapshot.model";
import { ChartsService } from "./charts.service";
export declare class ChartsController {
  chartsService: ChartsService;
  loadVaultCharts(address: string, timeframe?: ChartTimeFrame, chain?: Network): Promise<HistoricVaultSnapshotModel[]>;
}
