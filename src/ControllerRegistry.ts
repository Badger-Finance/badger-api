import { AccountsController } from './accounts/accounts.controller';
import { BoostsController } from './boosts/boosts.controller';
import { ChartsController } from './charts/charts.controller';
import { ClawController } from './claw/claw.controller';
import { GeyserController } from './geysers/geysers.controller';
import { HarvestsController } from './harvests/harvests.controller';
import { PriceController } from './prices/prices.controller';
import { ProtocolController } from './protocols/protocols.controller';
import { RewardController } from './rewards/rewards.controller';
import { SettsController } from './setts/setts.controller';

/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
export const controllers = [
  ChartsController,
  ClawController,
  GeyserController,
  HarvestsController,
  PriceController,
  ProtocolController,
  RewardController,
  SettsController,
  AccountsController,
  BoostsController,
];
