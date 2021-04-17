import { SettSummary } from '../../setts/interfaces/sett-summary.interface';

export interface ProtocolSummary {
  totalValue: number;
  setts?: SettSummary[];
}
