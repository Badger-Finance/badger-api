import { Token } from "./Token";

export interface MasterChefPool {
  poolId: number;
  allocPoint: number;
  depositToken: Token;
  emission: PoolEmission;
};

/**
 * TODO: Maybe we move this to a generic
 * file for abstract farming classes. 
 */
export interface PoolEmission {
  token: Token;
  apr: number;
};
