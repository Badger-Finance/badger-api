import { Protocol, VaultBehavior, VaultState } from '@badger-dao/sdk';
import { Chain } from '../../chains/config/chain.config';
import { Stage } from '../../config/enums/stage.enum';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { CachedLiquidityPoolTokenBalance } from '../../tokens/interfaces/cached-liquidity-pool-token-balance.interface';

export interface VaultDefinition {
  balanceDecimals?: number;
  createdBlock: number;
  depositToken: string;
  deprecated?: boolean;
  experimental?: boolean;
  getTokenBalance?: (chain: Chain, token: string) => Promise<CachedLiquidityPoolTokenBalance>;
  bouncer?: BouncerType;
  name: string;
  newVault?: boolean;
  protocol?: Protocol;
  vaultToken: string;
  stage?: Stage;
  state?: VaultState;
  strategy?: string;
  supplyDecimals?: number;
  behavior?: VaultBehavior;
}
