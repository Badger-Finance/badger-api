import { Protocol } from '../../config/enums/protocol.enum';
import { Stage } from '../../config/enums/stage.enum';
import { CachedLiquidityPoolTokenBalance } from '../../tokens/interfaces/cached-liquidity-pool-token-balance.interface';

export interface SettDefinition {
  balanceDecimals?: number;
  createdBlock: number;
  depositToken: string;
  experimental?: boolean;
  getTokenBalance?: () => Promise<CachedLiquidityPoolTokenBalance>;
  hasBouncer?: boolean;
  name: string;
  protocol?: Protocol;
  settToken: string;
  stage?: Stage;
  strategy?: string;
  supplyDecimals?: number;
}
