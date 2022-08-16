import '@tsed/ajv';
import '@tsed/swagger';
import './common/filters/tsed-exception-filter';
import './common/filters/api-exception-filter';

import { Configuration } from '@tsed/di';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import methodOverride from 'method-override';

import { swaggerConfig } from './config/constants';
import { V2_CONTROLLERS, V3_CONTROLLERS } from './controllers';

@Configuration({
  rootDir: __dirname,
  acceptMimes: ['application/json'],
  mount: {
    '/v2': [V2_CONTROLLERS],
    '/v3': [V3_CONTROLLERS],
  },
  swagger: [swaggerConfig],
  cache: {
    ttl: 120,
    store: 'memory',
  },
  exclude: ['**/*.spec.ts'],
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
