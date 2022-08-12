import '@tsed/platform-express';
import './common/filters/tsed-exception-filter';
import './common/filters/api-exception-filter';
import '@tsed/swagger';

import { Configuration } from '@tsed/common';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import methodOverride from 'method-override';

import { swaggerConfig } from './config/constants';
import { V2_CONTROLLERS, V3_CONTROLLERS } from './ControllerRegistry';

@Configuration({
  rootDir: __dirname,
  acceptMimes: ['application/json'],
  mount: {
    '/v2/': V2_CONTROLLERS,
    '/v3/': V3_CONTROLLERS,
  },
  swagger: [swaggerConfig],
  logger: {
    disableRoutesSummary: true,
    disableBootstrapLog: true,
    logRequest: false,
  },
  cache: {
    ttl: 120, // default TTL
    store: 'memory',
  },
  middlewares: [
    cors(),
    cookieParser(),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true,
    }),
  ],
})
export class Server {}
