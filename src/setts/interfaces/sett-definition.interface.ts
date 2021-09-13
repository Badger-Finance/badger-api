import { Chain } from '../../chains/config/chain.config';
import { Protocol } from '../../config/enums/protocol.enum';
import { SettState } from '../../config/enums/sett-state.enum';
import { Stage } from '../../config/enums/stage.enum';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { CachedLiquidityPoolTokenBalance } from '../../tokens/interfaces/cached-liquidity-pool-token-balance.interface';

export interface SettDefinition {
  balanceDecimals?: number;
  createdBlock: number;
  depositToken: string;
  deprecated?: boolean;
  experimental?: boolean;
  getTokenBalance?: (chain: Chain, token: string) => Promise<CachedLiquidityPoolTokenBalance>;
  bouncer?: BouncerType;
  name: string;
  protocol?: Protocol;
  settToken: string;
  stage?: Stage;
  state?: SettState;
  strategy?: string;
  supplyDecimals?: number;
}
