import { BigNumber } from 'ethers';
import { Token } from './Token';

export interface Geyser {
	emissions: Emission[];
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
