import { ChartController } from './controller/ChartController';
import { ClawController } from './controller/ClawController';
import { GeyserController } from './controller/GeyserController';
import { LinkController } from './controller/LinkController';
import { ProtocolController } from './controller/ProtocolController';
import { RewardController } from './controller/RewardController';
import { SettController } from './controller/SettController';

/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
export const controllers = [
	LinkController,
	ProtocolController,
	SettController,
	ChartController,
	GeyserController,
	ClawController,
	RewardController,
];
