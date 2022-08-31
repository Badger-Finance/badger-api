import { YieldType } from '../enums/yield-type.enum';

export interface YieldEvent {
  block: number;
  timestamp: number;
  type: YieldType;
  amount: number;
  token: string;
  balance: number;
  value: number;
  earned: number;
  apr: number;
}
