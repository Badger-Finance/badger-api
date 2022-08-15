import { Currency, Network } from "@badger-dao/sdk";
import { VaultsService } from "../vaults/vaults.service";
import { ProtocolSummaryModel } from "./interfaces/protocol-summary-model.interface";
export declare class ProtocolController {
  vaultsService: VaultsService;
  getAssetsUnderManagement(chain?: Network, currency?: Currency): Promise<ProtocolSummaryModel>;
}
