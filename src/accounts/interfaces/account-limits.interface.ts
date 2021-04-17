import { DepositLimit } from './deposit-limit.interface';

export interface AccountLimits {
  [contract: string]: DepositLimit;
}
