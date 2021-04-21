import { BigNumber } from 'ethers';
import { Token } from '../../tokens/interfaces/token.interface';

export interface Geyser {
  emissions: (Emission | undefined)[];
}

export interface Emission {
  token: Token;
  unlockSchedule: UnlockSchedule;
}

export interface UnlockSchedule {
  initialLocked: BigNumber;
  endAtSec: BigNumber;
  durationSec: BigNumber;
  startTime: BigNumber;
}
