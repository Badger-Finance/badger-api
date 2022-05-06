import { CitadelController } from './citadel/citadel.controller';

/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
export const CITADEL_V1_CONTROLLERS = [CitadelController];
