import { Protocol } from '../../config/enums/protocol.enum';
import { SettState } from '../../config/enums/sett-state.enum';
import { Stage } from '../../config/enums/stage.enum';
import { CachedLiquidityPoolTokenBalance } from '../../tokens/interfaces/cached-liquidity-pool-token-balance.interface';

export interface SettDefinition {
  balanceDecimals?: number;
  createdBlock: number;
  depositToken: string;
  experimental?: boolean;
  getTokenBalance?: (token: string) => Promise<CachedLiquidityPoolTokenBalance>;
  hasBouncer?: boolean;
  name: string;
  protocol?: Protocol;
  settToken: string;
  stage?: Stage;
  state?: SettState;
  strategy?: string;
  supplyDecimals?: number;
}
