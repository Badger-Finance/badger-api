import { TreasuryPosition } from './treasy-position.interface';

export interface CitadelTreasurySummary {
  value: number;
  valueBtc: number;
  valuePaid: number;
  valuePaidBtc: number;
  marketCapToTreasuryRatio: number;
  treasuryYieldApr: number;
  positions: TreasuryPosition[];
}
