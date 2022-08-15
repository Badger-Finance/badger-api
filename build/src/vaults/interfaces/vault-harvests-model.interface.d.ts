import { HarvestType } from "../enums/harvest.enum";
import { VaultHarvestsExtendedResp } from "./vault-harvest-extended-resp.interface";
export declare class VaultHarvestsModel implements VaultHarvestsExtendedResp {
  timestamp: number;
  block: number;
  token: string;
  amount: number;
  eventType: HarvestType;
  strategyBalance?: number;
  estimatedApr?: number;
  constructor({ timestamp, block, token, amount, eventType, strategyBalance, estimatedApr }: VaultHarvestsExtendedResp);
}
