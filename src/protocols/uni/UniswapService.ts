import { Service } from '@tsed/di';
import { Chain } from '../../config/chain';
import { UNISWAP_URL } from '../../config/constants';
import { Performance } from '../../interface/Performance';
import { SettData } from '../../service/setts';
import { SwapService } from '../common/SwapService';

@Service()
export class UniswapService extends SwapService {
	constructor() {
		super(UNISWAP_URL);
	}

	// required abstract method, uniswap is not currently cross chain
	/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
	async getPairPerformance(chain: Chain, sett: SettData): Promise<Performance> {
		return await this.getSwapPerformance(sett.depositToken);
	}
}
