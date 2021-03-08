import { ChartController } from './controller/ChartController';
import { ClawController } from './controller/ClawController';
import { GeyserController } from './controller/GeyserController';
import { LinkController } from './controller/LinkController';
import { PriceController } from './controller/PriceController';
import { ProtocolController } from './controller/ProtocolController';
import { RewardController } from './controller/RewardController';
import { SettController } from './setts/SettsController';
import { HarvestsController } from './harvests/HarvestsController';

/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
export const controllers = [
	ChartController,
	ClawController,
	GeyserController,
	HarvestsController,
	LinkController,
	PriceController,
	ProtocolController,
	RewardController,
	SettController,
];
