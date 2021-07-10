import '@tsed/platform-express';
import { PlatformAws } from '@tsed/platform-aws';
import { SwaggerSettings } from '@tsed/swagger';
import { API_VERSION } from './config/constants';
import { Server } from './Server';

export const swaggerConfig: SwaggerSettings = {
  path: '/docs',
  spec: {
    info: {
      title: 'Badger API',
      description: 'Collection of serverless API to enable public access to data surrounding the Badger protocol.',
      version: API_VERSION,
      contact: {
        name: 'Badger Finance',
        email: 'jintao@badger.finance',
        url: 'https://app.badger.finance/',
      },
    },
    host: 'https://api.badger.finance',
    basePath: '/v2',
  },
};

PlatformAws.bootstrap(Server, {
  aws: { binaryMimeTypes: [] },
  swagger: [swaggerConfig],
});

export const handler = PlatformAws.callback();
