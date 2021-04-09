import { ChartsController } from './charts/ChartsController';
import { ClawController } from './controller/ClawController';
import { GeyserController } from './geysers/GeysersController';
import { HarvestsController } from './harvests/harvests.controller';
import { PriceController } from './prices/PricesController';
import { ProtocolController } from './protocols/protocols.controller';
import { RewardController } from './rewards/rewards.controller';
import { SettsController } from './setts/SettsController';

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
];
