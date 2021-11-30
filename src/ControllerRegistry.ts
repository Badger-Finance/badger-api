import { AccountsController } from './accounts/accounts.controller';
import { ChartsController } from './charts/charts.controller';
import { GasController } from './gas/gas.controller';
import { HealthController } from './health/health.controller';
import { LeaderBoardsController } from './leaderboards/leaderboards.controller';
import { MetricsController } from './metrics/metrics.controller';
import { PriceController } from './prices/prices.controller';
import { ProtocolController } from './protocols/protocols.controller';
import { RewardController } from './rewards/rewards.controller';
import { SettsController } from './setts/setts.controller';
import { TokensController } from './tokens/tokens.controller';

/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
export const controllers = [
  ChartsController,
  PriceController,
  ProtocolController,
  RewardController,
  SettsController,
  AccountsController,
  LeaderBoardsController,
  TokensController,
  HealthController,
  MetricsController,
  GasController,
];
