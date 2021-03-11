import { BigNumber } from 'ethers';

export interface PoolInfo {
  lpToken: string;
  allocPoint: BigNumber;
  lastRewardBlock: BigNumber;
  accSushiPerShare: BigNumber;
}
