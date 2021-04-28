import { BigNumber } from '@ethersproject/bignumber';

export interface UnlockSchedule {
  beneficiary: string;
  token: string;
  totalAmount: BigNumber;
  start: BigNumber;
  end: BigNumber;
  duration: BigNumber;
}
